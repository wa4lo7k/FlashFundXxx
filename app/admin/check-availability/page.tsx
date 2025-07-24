"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminAccountContainerService } from '@/lib/admin-database'
import { toast } from 'sonner'

export default function CheckAvailabilityPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [availability, setAvailability] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Get all accounts
      const { data: accountsData, error: accountsError } = await adminAccountContainerService.getAllAccounts()
      if (accountsError) {
        toast.error(`Error fetching accounts: ${accountsError.message}`)
        return
      }
      setAccounts(accountsData || [])

      // Get availability count
      const { data: availabilityData, error: availabilityError } = await adminAccountContainerService.getAvailabilityCount()
      if (availabilityError) {
        toast.error(`Error fetching availability: ${availabilityError.message}`)
        return
      }
      setAvailability(availabilityData || [])

    } catch (err: any) {
      toast.error(`Failed to fetch data: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addTestAccount = async () => {
    try {
      const testAccount = {
        account_size: 1000,
        platform_type: 'mt4',
        server_name: 'FlashFundX-Demo',
        login_id: 'TEST123456',
        password: 'TestPass123',
        investor_password: 'InvestorPass123',
        status: 'available',
        notes: 'Test account for delivery testing'
      }

      const { data, error } = await adminAccountContainerService.addAccount(testAccount)
      
      if (error) {
        toast.error(`Error adding test account: ${error.message}`)
        return
      }

      toast.success('Test account added successfully!')
      fetchData() // Refresh data
    } catch (err: any) {
      toast.error(`Failed to add test account: ${err.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Availability Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={fetchData} disabled={isLoading}>
              Refresh Data
            </Button>
            
            <Button onClick={addTestAccount} variant="outline">
              Add Test 1K MT4 Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Accounts Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {availability.length === 0 ? (
            <div className="text-red-600 font-semibold">
              ⚠️ NO AVAILABLE ACCOUNTS FOUND!
              <p className="text-sm text-gray-600 mt-2">
                This is likely why account delivery is failing. You need to add accounts to the container.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {availability.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>${item.account_size} {item.platform_type.toUpperCase()}</span>
                  <span className="font-semibold text-green-600">{item.available_count} available</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Accounts ({accounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {accounts.length === 0 ? (
              <div className="text-gray-600">No accounts in container</div>
            ) : (
              accounts.map((account) => (
                <div key={account.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">
                      ${account.account_size} {account.platform_type.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Login: {account.login_id} | Server: {account.server_name}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-sm ${
                    account.status === 'available' ? 'bg-green-100 text-green-800' :
                    account.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                    account.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {account.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>For order FFX433073137:</strong></p>
            <p>• Account Size: $1,000</p>
            <p>• Platform: MT4 (likely)</p>
            <p>• Account Type: two_step</p>
            <p>• Status Required: available</p>
            <br />
            <p className="text-blue-600">
              <strong>To fix delivery:</strong> Add at least one $1,000 MT4 account with status 'available'
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
