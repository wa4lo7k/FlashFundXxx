'use client'

import { useState, useEffect } from 'react'
import { adminCryptoAddressService, supabaseAdmin } from '@/lib/admin-database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Coins,
  Upload,
  Edit,
  Save,
  X,
  Plus,
  Eye,
  EyeOff,
  Image,
  Trash2,
  QrCode,
  Wallet
} from 'lucide-react'

interface CryptoAddress {
  id: string
  crypto_name: string
  network: string
  wallet_address: string
  qr_code_url: string | null
  display_name: string
  is_active: boolean
  sort_order: number
  notes: string | null
  created_at: string
}

export default function CryptoManagementPage() {
  const [cryptoAddresses, setCryptoAddresses] = useState<CryptoAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [showAddresses, setShowAddresses] = useState<{[key: string]: boolean}>({})
  const [uploadingQR, setUploadingQR] = useState<string | null>(null)

  const [newCrypto, setNewCrypto] = useState({
    crypto_name: '',
    network: '',
    wallet_address: '',
    display_name: '',
    notes: ''
  })

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const fetchCryptoAddresses = async () => {
    try {
      const { data, error } = await adminCryptoAddressService.getAllAddresses()

      if (error) {
        showMessage(`Error fetching crypto addresses: ${error.message}`, 'error')
        return
      }

      setCryptoAddresses(data || [])
    } catch (err: any) {
      showMessage(`Failed to fetch crypto addresses: ${err.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAddressVisibility = (id: string) => {
    setShowAddresses(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleQRUpload = async (cryptoId: string, file: File) => {
    if (!file) {
      showMessage('No file selected', 'error')
      return
    }

    console.log('🔍 QR Upload Debug:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      cryptoId
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('Please upload an image file (PNG, JPG, JPEG)', 'error')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('File size must be less than 5MB', 'error')
      return
    }

    setUploadingQR(cryptoId)

    try {
      // Get crypto info for file naming
      const crypto = cryptoAddresses.find(c => c.id === cryptoId)
      if (!crypto) {
        showMessage('Crypto address not found', 'error')
        return
      }

      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop() || 'png'
      const fileName = `crypto/${crypto.crypto_name.replace(/\s+/g, '_')}_${crypto.network}_${timestamp}.${fileExtension}`

      console.log('📁 Uploading to storage:', fileName)

      // First, check if bucket exists and is accessible
      const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
      console.log('🪣 Available buckets:', buckets, bucketsError)

      // Try to create bucket if it doesn't exist
      if (!buckets?.find(b => b.name === 'qr-codes')) {
        console.log('🔧 Creating qr-codes bucket...')
        const { data: createBucket, error: createError } = await supabaseAdmin.storage.createBucket('qr-codes', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
          fileSizeLimit: 5242880 // 5MB
        })
        console.log('🪣 Bucket creation result:', createBucket, createError)
      }

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('qr-codes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      console.log('📤 Upload result:', uploadData, uploadError)

      if (uploadError) {
        showMessage(`Upload failed: ${uploadError.message}`, 'error')
        console.error('❌ Upload error details:', uploadError)
        return
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('qr-codes')
        .getPublicUrl(fileName)

      console.log('🔗 Public URL:', urlData)

      if (!urlData.publicUrl) {
        showMessage('Failed to get public URL for uploaded file', 'error')
        return
      }

      // Update database with QR code URL
      const { error: updateError } = await adminCryptoAddressService.updateAddress(cryptoId, {
        qr_code_url: urlData.publicUrl
      })

      if (updateError) {
        showMessage(`Failed to update QR code: ${updateError.message}`, 'error')
        console.error('❌ Database update error:', updateError)
        return
      }

      showMessage('QR code uploaded successfully!', 'success')
      await fetchCryptoAddresses()
    } catch (err: any) {
      console.error('❌ QR Upload error:', err)
      showMessage(`Upload failed: ${err.message}`, 'error')
    } finally {
      setUploadingQR(null)
    }
  }

  const addCryptoAddress = async () => {
    if (!newCrypto.crypto_name || !newCrypto.wallet_address) {
      showMessage('Please fill in all required fields', 'error')
      return
    }

    try {
      const { error } = await adminCryptoAddressService.addAddress({
        crypto_name: newCrypto.crypto_name,
        network: newCrypto.network,
        wallet_address: newCrypto.wallet_address,
        display_name: newCrypto.display_name,
        notes: newCrypto.notes,
        is_active: true,
        sort_order: cryptoAddresses.length + 1
      })

      if (error) {
        showMessage(`Error adding crypto address: ${error.message}`, 'error')
        return
      }

      showMessage('Crypto address added successfully!', 'success')
      setShowAddForm(false)
      setNewCrypto({
        crypto_name: '',
        network: '',
        wallet_address: '',
        display_name: '',
        notes: ''
      })
      await fetchCryptoAddresses()
    } catch (err: any) {
      showMessage(`Failed to add crypto address: ${err.message}`, 'error')
    }
  }

  const updateCryptoAddress = async (id: string, updates: Partial<CryptoAddress>) => {
    try {
      const { error } = await adminCryptoAddressService.updateAddress(id, updates)

      if (error) {
        showMessage(`Error updating crypto address: ${error.message}`, 'error')
        return
      }

      showMessage('Crypto address updated successfully!', 'success')
      setEditingId(null)
      await fetchCryptoAddresses()
    } catch (err: any) {
      showMessage(`Failed to update crypto address: ${err.message}`, 'error')
    }
  }

  const toggleCryptoStatus = async (id: string, currentStatus: boolean) => {
    await updateCryptoAddress(id, { is_active: !currentStatus })
  }

  const deleteCryptoAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crypto address?')) return

    try {
      const { error } = await adminCryptoAddressService.deleteAddress(id)

      if (error) {
        showMessage(`Error deleting crypto address: ${error.message}`, 'error')
        return
      }

      showMessage('Crypto address deleted successfully!', 'success')
      await fetchCryptoAddresses()
    } catch (err: any) {
      showMessage(`Failed to delete crypto address: ${err.message}`, 'error')
    }
  }

  const handleCryptoChange = (id: string, field: string, value: any) => {
    setCryptoAddresses(prev => prev.map(crypto => 
      crypto.id === id ? { ...crypto, [field]: value } : crypto
    ))
  }

  const saveCrypto = (crypto: CryptoAddress) => {
    updateCryptoAddress(crypto.id, {
      crypto_name: crypto.crypto_name,
      network: crypto.network,
      wallet_address: crypto.wallet_address,
      display_name: crypto.display_name,
      notes: crypto.notes
    })
  }

  useEffect(() => {
    fetchCryptoAddresses()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading crypto addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Coins className="w-6 h-6 mr-2 text-emerald-400" />
            Crypto Payment Management
          </CardTitle>
          <p className="text-slate-400">
            Manage cryptocurrency addresses and QR codes for user payments
          </p>
        </CardHeader>
        <CardContent>
          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg border mb-4 ${
              messageType === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
              messageType === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
              'bg-blue-900/20 border-blue-500/30 text-blue-400'
            }`}>
              {message}
            </div>
          )}

          {/* Add New Crypto Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Cryptocurrency Addresses</h3>
              <p className="text-sm text-slate-400">Configure payment addresses and upload QR codes</p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Crypto Address
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Crypto Form */}
      {showAddForm && (
        <Card className="glass-card border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg text-white">Add New Cryptocurrency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Crypto Name *</label>
                <Input
                  placeholder="e.g., USDT BEP20"
                  value={newCrypto.crypto_name}
                  onChange={(e) => setNewCrypto({...newCrypto, crypto_name: e.target.value})}
                  className="glass-card border-slate-700/50 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Network *</label>
                <Input
                  placeholder="e.g., BEP20"
                  value={newCrypto.network}
                  onChange={(e) => setNewCrypto({...newCrypto, network: e.target.value})}
                  className="glass-card border-slate-700/50 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Wallet Address *</label>
              <Input
                placeholder="Enter wallet address"
                value={newCrypto.wallet_address}
                onChange={(e) => setNewCrypto({...newCrypto, wallet_address: e.target.value})}
                className="glass-card border-slate-700/50 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Display Name *</label>
              <Input
                placeholder="e.g., USDT (BEP20)"
                value={newCrypto.display_name}
                onChange={(e) => setNewCrypto({...newCrypto, display_name: e.target.value})}
                className="glass-card border-slate-700/50 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Notes (Optional)</label>
              <Input
                placeholder="Additional notes or instructions"
                value={newCrypto.notes}
                onChange={(e) => setNewCrypto({...newCrypto, notes: e.target.value})}
                className="glass-card border-slate-700/50 text-white"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={addCryptoAddress} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Add Crypto Address
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crypto Addresses List */}
      <div className="space-y-4">
        {cryptoAddresses.length === 0 ? (
          <Card className="glass-card border-slate-800/50">
            <CardContent className="text-center py-12">
              <Coins className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No crypto addresses found</p>
              <p className="text-sm text-slate-500 mt-2">Add your first cryptocurrency address to get started</p>
            </CardContent>
          </Card>
        ) : (
          cryptoAddresses.map((crypto) => (
            <Card key={crypto.id} className="glass-card border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {crypto.display_name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={crypto.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {crypto.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-sm text-slate-400">
                          {crypto.crypto_name} • {crypto.network}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingId === crypto.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveCrypto(crypto)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null)
                            fetchCryptoAddresses() // Reset changes
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(crypto.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleCryptoStatus(crypto.id, crypto.is_active)}
                        >
                          {crypto.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCryptoAddress(crypto.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Address Information */}
                  <div className="lg:col-span-2 space-y-4">
                    {editingId === crypto.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-400">Crypto Name</label>
                            <Input
                              value={crypto.crypto_name}
                              onChange={(e) => handleCryptoChange(crypto.id, 'crypto_name', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-400">Network</label>
                            <Input
                              value={crypto.network}
                              onChange={(e) => handleCryptoChange(crypto.id, 'network', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Display Name</label>
                          <Input
                            value={crypto.display_name}
                            onChange={(e) => handleCryptoChange(crypto.id, 'display_name', e.target.value)}
                            className="glass-card border-slate-700/50 text-white h-8 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Wallet Address</label>
                          <Input
                            value={crypto.wallet_address}
                            onChange={(e) => handleCryptoChange(crypto.id, 'wallet_address', e.target.value)}
                            className="glass-card border-slate-700/50 text-white h-8 text-sm font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Notes (Optional)</label>
                          <Input
                            value={crypto.notes || ''}
                            onChange={(e) => handleCryptoChange(crypto.id, 'notes', e.target.value)}
                            className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            placeholder="Additional notes or instructions"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-400">Wallet Address</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-white font-mono bg-slate-900/50 p-2 rounded border border-slate-700/50 flex-1">
                              {showAddresses[crypto.id] ? crypto.wallet_address : '••••••••••••••••••••••••••••••••••••••••'}
                            </span>
                            <button
                              onClick={() => toggleAddressVisibility(crypto.id)}
                              className="text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                              {showAddresses[crypto.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-slate-400">Network</label>
                            <p className="text-sm text-white">{crypto.network}</p>
                          </div>
                          <div>
                            <label className="text-xs text-slate-400">Created</label>
                            <p className="text-sm text-white">{new Date(crypto.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {crypto.notes && (
                          <div>
                            <label className="text-xs text-slate-400">Notes</label>
                            <p className="text-sm text-white">{crypto.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* QR Code Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-300 flex items-center">
                      <QrCode className="w-4 h-4 mr-1 text-emerald-400" />
                      QR Code
                    </h4>

                    {crypto.qr_code_url ? (
                      <div className="space-y-3">
                        <div className="bg-white p-2 rounded-lg">
                          <img
                            src={crypto.qr_code_url}
                            alt={`${crypto.display_name} QR Code`}
                            className="w-full h-32 object-contain"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <input
                            id={`replace-qr-${crypto.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                console.log('🔄 Replace QR file selected:', file.name)
                                handleQRUpload(crypto.id, file)
                              }
                              // Reset input value to allow same file selection
                              e.target.value = ''
                            }}
                            className="hidden"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled={uploadingQR === crypto.id}
                            onClick={() => {
                              console.log('🔄 Replace QR button clicked for:', crypto.id)
                              const input = document.getElementById(`replace-qr-${crypto.id}`) as HTMLInputElement
                              input?.click()
                            }}
                          >
                            {uploadingQR === crypto.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-400 mr-1"></div>
                            ) : (
                              <Upload className="w-3 h-3 mr-1" />
                            )}
                            Replace
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
                        <QrCode className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 mb-3">No QR code uploaded</p>
                        <input
                          id={`upload-qr-${crypto.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              console.log('📤 Upload QR file selected:', file.name)
                              handleQRUpload(crypto.id, file)
                            }
                            // Reset input value to allow same file selection
                            e.target.value = ''
                          }}
                          className="hidden"
                        />
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={uploadingQR === crypto.id}
                          onClick={() => {
                            console.log('📤 Upload QR button clicked for:', crypto.id)
                            const input = document.getElementById(`upload-qr-${crypto.id}`) as HTMLInputElement
                            input?.click()
                          }}
                        >
                          {uploadingQR === crypto.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          ) : (
                            <Upload className="w-3 h-3 mr-1" />
                          )}
                          Upload QR Code
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
