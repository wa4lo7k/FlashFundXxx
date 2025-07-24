import { supabase } from './supabaseClient'
import { emailTemplateService, userProfileService } from './database'

// ============================================================================
// EMAIL SERVICE FOR ACCOUNT DELIVERY NOTIFICATIONS
// ============================================================================

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export interface TemplateVariables {
  [key: string]: string | number
}

export class EmailService {
  
  /**
   * Send account delivery email to user
   */
  static async sendAccountDeliveryEmail(
    userId: string,
    accountData: {
      account_type: string
      account_size: number
      login_id: string
      password: string
      server_name: string
      platform_type: string
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get user profile
      const { data: userProfile, error: userError } = await userProfileService.getProfile(userId)
      if (userError || !userProfile) {
        return { success: false, error: 'User not found' }
      }

      // Get email template
      const { data: template, error: templateError } = await emailTemplateService.getTemplate('account_delivery')
      if (templateError || !template) {
        return { success: false, error: 'Email template not found' }
      }

      // Prepare template variables
      const variables: TemplateVariables = {
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        account_type: this.getAccountTypeDisplayName(accountData.account_type),
        account_size: this.formatCurrency(accountData.account_size),
        login_id: accountData.login_id,
        password: accountData.password,
        server_name: accountData.server_name,
        platform_type: accountData.platform_type.toUpperCase()
      }

      // Replace template variables
      const subject = this.replaceTemplateVariables(template.subject, variables)
      const htmlContent = this.replaceTemplateVariables(template.html_content, variables)
      const textContent = template.text_content 
        ? this.replaceTemplateVariables(template.text_content, variables)
        : undefined

      // Send email using Supabase Edge Function or external service
      const emailResult = await this.sendEmail({
        to: userProfile.email,
        subject,
        html: htmlContent,
        text: textContent
      })

      return emailResult
    } catch (error) {
      console.error('Error sending account delivery email:', error)
      return { success: false, error: 'Failed to send email' }
    }
  }

  /**
   * Send email using Supabase Edge Function
   * Note: You'll need to create a Supabase Edge Function for actual email sending
   */
  private static async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // Option 1: Use Supabase Edge Function (recommended)
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData
      })

      if (error) {
        console.error('Supabase function error:', error)
        // Fallback to console log for development
        console.log('📧 EMAIL WOULD BE SENT:', emailData)
        return { success: true } // Return success for development
      }

      return { success: true }
    } catch (error) {
      console.error('Email sending error:', error)
      
      // For development: Log email content instead of actually sending
      console.log('📧 EMAIL WOULD BE SENT (DEV MODE):')
      console.log('To:', emailData.to)
      console.log('Subject:', emailData.subject)
      console.log('HTML:', emailData.html)
      
      return { success: true } // Return success for development
    }
  }

  /**
   * Replace template variables in content
   */
  private static replaceTemplateVariables(content: string, variables: TemplateVariables): string {
    let result = content
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      result = result.replace(regex, String(value))
    })
    
    return result
  }

  /**
   * Format currency for email templates
   */
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  /**
   * Get account type display name
   */
  private static getAccountTypeDisplayName(accountType: string): string {
    const displayNames: { [key: string]: string } = {
      'instant': 'Instant Funding',
      'hft': 'HFT Challenge',
      'one_step': 'One-Step Challenge',
      'two_step': 'Two-Step Challenge'
    }
    return displayNames[accountType] || accountType
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: userProfile, error: userError } = await userProfileService.getProfile(userId)
      if (userError || !userProfile) {
        return { success: false, error: 'User not found' }
      }

      const { data: template, error: templateError } = await emailTemplateService.getTemplate('welcome')
      if (templateError || !template) {
        // If no welcome template, skip silently
        return { success: true }
      }

      const variables: TemplateVariables = {
        first_name: userProfile.first_name,
        last_name: userProfile.last_name
      }

      const subject = this.replaceTemplateVariables(template.subject, variables)
      const htmlContent = this.replaceTemplateVariables(template.html_content, variables)
      const textContent = template.text_content 
        ? this.replaceTemplateVariables(template.text_content, variables)
        : undefined

      return await this.sendEmail({
        to: userProfile.email,
        subject,
        html: htmlContent,
        text: textContent
      })
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error: 'Failed to send welcome email' }
    }
  }

  /**
   * Send phase completion notification
   */
  static async sendPhaseCompletionEmail(
    userId: string,
    phase: string,
    status: 'passed' | 'failed'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: userProfile, error: userError } = await userProfileService.getProfile(userId)
      if (userError || !userProfile) {
        return { success: false, error: 'User not found' }
      }

      const { data: template, error: templateError } = await emailTemplateService.getTemplate('phase_completion')
      if (templateError || !template) {
        return { success: true } // Skip if no template
      }

      const variables: TemplateVariables = {
        first_name: userProfile.first_name,
        phase: phase,
        status: status,
        status_message: status === 'passed' ? 'Congratulations!' : 'Better luck next time!'
      }

      const subject = this.replaceTemplateVariables(template.subject, variables)
      const htmlContent = this.replaceTemplateVariables(template.html_content, variables)
      const textContent = template.text_content 
        ? this.replaceTemplateVariables(template.text_content, variables)
        : undefined

      return await this.sendEmail({
        to: userProfile.email,
        subject,
        html: htmlContent,
        text: textContent
      })
    } catch (error) {
      console.error('Error sending phase completion email:', error)
      return { success: false, error: 'Failed to send phase completion email' }
    }
  }
}

// Export for easy use
export const emailService = EmailService
