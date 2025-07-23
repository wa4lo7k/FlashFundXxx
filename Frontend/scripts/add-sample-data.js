// Sample data script to populate the database for testing admin dashboard
const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://evogjimjdofyrpqaukdq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b2dqaW1qZG9meXJwcWF1a2RxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI0MjQyOSwiZXhwIjoyMDY3ODE4NDI5fQ.hzhtT1KkZDO6UNqaW2E8Au_Dqb2O1YXMxsbphOUPs5E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addSampleData() {
  console.log('🚀 Adding sample data to FlashFundX database...')

  try {
    // First, let's check if we have any existing users
    console.log('🔍 Checking for existing users...')
    const { data: existingUsers, error: userCheckError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, email')
      .limit(5)

    if (userCheckError) {
      console.log('❌ Error checking users:', userCheckError.message)
      return
    }

    console.log(`📊 Found ${existingUsers?.length || 0} existing users`)

    if (!existingUsers || existingUsers.length === 0) {
      console.log('⚠️ No users found. You need to sign up some users first through the website.')
      console.log('💡 Go to http://localhost:3000/signup and create a few test accounts first.')
      return
    }

    // Use existing users for sample orders
    const sampleUserId = existingUsers[0].id
    console.log(`👤 Using existing user: ${existingUsers[0].first_name} ${existingUsers[0].last_name} (${existingUsers[0].email})`)

    // 2. Add sample orders using existing user
    console.log('📋 Adding sample orders...')
    const sampleOrders = [
      {
        order_id: 'FFX123456789',
        user_id: sampleUserId,
        account_type: 'two_step',
        account_size: 50000,
        platform_type: 'mt5',
        amount: 299,
        final_amount: 299,
        payment_method: 'crypto',
        crypto_currency: 'USDT BEP20',
        order_status: 'completed',
        payment_status: 'paid',
        delivery_status: 'delivered',
        transaction_id: 'TX123456789',
        paid_at: new Date().toISOString(),
        delivered_at: new Date().toISOString()
      },
      {
        order_id: 'FFX987654321',
        user_id: sampleUserId,
        account_type: 'one_step',
        account_size: 25000,
        platform_type: 'mt4',
        amount: 199,
        final_amount: 199,
        payment_method: 'crypto',
        crypto_currency: 'Bitcoin',
        order_status: 'processing',
        payment_status: 'paid',
        delivery_status: 'pending',
        transaction_id: 'TX987654321',
        paid_at: new Date().toISOString()
      },
      {
        order_id: 'FFX555666777',
        user_id: sampleUserId,
        account_type: 'instant',
        account_size: 100000,
        platform_type: 'mt5',
        amount: 599,
        final_amount: 599,
        payment_method: 'crypto',
        crypto_currency: 'Ethereum',
        order_status: 'pending',
        payment_status: 'pending',
        delivery_status: 'pending',
        transaction_id: 'TX555666777'
      },
      {
        order_id: 'FFX111222333',
        user_id: sampleUserId,
        account_type: 'hft',
        account_size: 10000,
        platform_type: 'mt4',
        amount: 99,
        final_amount: 99,
        payment_method: 'crypto',
        crypto_currency: 'USDT TRC20',
        order_status: 'failed',
        payment_status: 'failed',
        delivery_status: 'failed',
        transaction_id: 'TX111222333'
      }
    ]

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .insert(sampleOrders)

    if (ordersError) {
      console.log('⚠️ Orders might already exist:', ordersError.message)
    } else {
      console.log('✅ Sample orders added successfully')
    }

    // 3. Add sample delivered accounts
    console.log('🏦 Adding sample delivered accounts...')
    const sampleAccounts = [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        user_id: '11111111-1111-1111-1111-111111111111',
        order_id: 'FFX123456789',
        account_type: 'two_step',
        account_size: 50000,
        platform_type: 'mt5',
        server_name: 'FlashFundX-Live01',
        login_id: '5001001',
        password: 'LivePass123!',
        investor_password: 'InvPass123',
        current_phase: 'live',
        phase_status: 'active',
        challenge_status: 'passed',
        phase_1_status: 'passed',
        phase_2_status: 'passed',
        live_status: 'active',
        account_status: 'active',
        email_sent: true,
        email_sent_at: new Date().toISOString()
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        user_id: '22222222-2222-2222-2222-222222222222',
        order_id: 'FFX987654321',
        account_type: 'one_step',
        account_size: 25000,
        platform_type: 'mt4',
        server_name: 'FlashFundX-Demo01',
        login_id: '2501001',
        password: 'ChallengePass123!',
        investor_password: 'InvPass124',
        current_phase: 'challenge',
        phase_status: 'active',
        challenge_status: 'active',
        phase_1_status: 'pending',
        phase_2_status: 'pending',
        live_status: 'pending',
        account_status: 'active',
        email_sent: true,
        email_sent_at: new Date().toISOString()
      }
    ]

    const { data: accountsData, error: accountsError } = await supabase
      .from('delivered_accounts')
      .insert(sampleAccounts)

    if (accountsError) {
      console.log('⚠️ Accounts might already exist:', accountsError.message)
    } else {
      console.log('✅ Sample delivered accounts added successfully')
    }

    console.log('🎉 Sample data added successfully!')
    console.log('📊 Summary:')
    console.log('   - 3 sample users')
    console.log('   - 4 sample orders (1 completed, 1 processing, 1 pending, 1 failed)')
    console.log('   - 2 sample delivered accounts')
    console.log('')
    console.log('🔄 Refresh your admin dashboard to see the data!')

  } catch (error) {
    console.error('❌ Error adding sample data:', error)
  }
}

// Run the script
addSampleData()
