"use client"

import { useState, useEffect } from "react"
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  File,
  Image,
  FileType,
  Share2,
  Edit,
  Star,
  Archive
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface Document {
  id: string
  name: string
  type: "identity" | "address" | "financial" | "trading" | "compliance" | "other"
  category: string
  format: "pdf" | "jpg" | "png" | "doc" | "xlsx"
  size: number
  uploadDate: string
  status: "pending" | "approved" | "rejected" | "expired"
  description?: string
  expiryDate?: string
  isRequired: boolean
  isStarred: boolean
  tags: string[]
}

interface DocumentCategory {
  id: string
  name: string
  description: string
  required: boolean
  count: number
  completionRate: number
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<DocumentCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])

  // Mock data
  const mockDocuments: Document[] = [
    {
      id: "doc_001",
      name: "Driver's License",
      type: "identity",
      category: "Identity Verification",
      format: "pdf",
      size: 2456789,
      uploadDate: "2024-01-15T10:30:00Z",
      status: "approved",
      description: "Government issued photo ID",
      expiryDate: "2026-03-15T00:00:00Z",
      isRequired: true,
      isStarred: false,
      tags: ["identity", "government", "photo-id"]
    },
    {
      id: "doc_002", 
      name: "Bank Statement",
      type: "financial",
      category: "Financial Verification",
      format: "pdf",
      size: 1834567,
      uploadDate: "2024-01-14T14:20:00Z",
      status: "pending",
      description: "Recent bank statement for address verification",
      isRequired: true,
      isStarred: true,
      tags: ["financial", "bank", "statement"]
    },
    {
      id: "doc_003",
      name: "Utility Bill",
      type: "address",
      category: "Address Verification", 
      format: "jpg",
      size: 987654,
      uploadDate: "2024-01-13T09:15:00Z",
      status: "approved",
      description: "Electricity bill for proof of address",
      isRequired: true,
      isStarred: false,
      tags: ["address", "utility", "proof"]
    },
    {
      id: "doc_004",
      name: "Trading Agreement",
      type: "trading",
      category: "Trading Documents",
      format: "pdf",
      size: 3456789,
      uploadDate: "2024-01-12T16:45:00Z",
      status: "approved",
      description: "Signed trading terms and conditions",
      isRequired: true,
      isStarred: false,
      tags: ["trading", "agreement", "legal"]
    },
    {
      id: "doc_005",
      name: "Tax Certificate",
      type: "compliance",
      category: "Tax Compliance",
      format: "pdf",
      size: 1234567,
      uploadDate: "2024-01-10T11:30:00Z",
      status: "expired",
      description: "Annual tax compliance certificate",
      expiryDate: "2024-01-01T00:00:00Z",
      isRequired: false,
      isStarred: false,
      tags: ["tax", "compliance", "certificate"]
    }
  ]

  const mockCategories: DocumentCategory[] = [
    {
      id: "identity",
      name: "Identity Verification",
      description: "Government issued photo identification documents",
      required: true,
      count: 1,
      completionRate: 100
    },
    {
      id: "address",
      name: "Address Verification",
      description: "Proof of residential address documents",
      required: true,
      count: 1,
      completionRate: 100
    },
    {
      id: "financial",
      name: "Financial Verification",
      description: "Bank statements and financial records",
      required: true,
      count: 1,
      completionRate: 50
    },
    {
      id: "trading",
      name: "Trading Documents",
      description: "Trading agreements and disclosures",
      required: true,
      count: 1,
      completionRate: 100
    },
    {
      id: "compliance",
      name: "Compliance Documents",
      description: "Regulatory and compliance certificates",
      required: false,
      count: 1,
      completionRate: 0
    }
  ]

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [documents, searchTerm, typeFilter, statusFilter])

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDocuments(mockDocuments)
      setCategories(mockCategories)
    } catch (error) {
      console.error("Error loading documents:", error)
      toast.error("Failed to load documents")
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...documents]

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(doc => doc.type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(doc => doc.status === statusFilter)
    }

    setFilteredDocuments(filtered)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(async (file) => {
      const tempId = `temp_${Date.now()}_${file.name}`
      setUploadingFiles(prev => [...prev, tempId])

      try {
        // Mock upload process
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const newDoc: Document = {
          id: `doc_${Date.now()}`,
          name: file.name,
          type: "other",
          category: "Uploaded Documents",
          format: file.name.split('.').pop() as any,
          size: file.size,
          uploadDate: new Date().toISOString(),
          status: "pending",
          description: `Uploaded file: ${file.name}`,
          isRequired: false,
          isStarred: false,
          tags: ["uploaded"]
        }

        setDocuments(prev => [...prev, newDoc])
        toast.success(`${file.name} uploaded successfully`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
      } finally {
        setUploadingFiles(prev => prev.filter(id => id !== tempId))
      }
    })

    // Reset input
    event.target.value = ''
  }

  const downloadDocument = (doc: Document) => {
    // Mock download
    const link = document.createElement('a')
    link.href = '#'
    link.download = doc.name
    link.click()
    toast.success(`Downloading ${doc.name}`)
  }

  const deleteDocument = async (docId: string) => {
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== docId))
      toast.success("Document deleted successfully")
    } catch (error) {
      toast.error("Failed to delete document")
    }
  }

  const toggleStar = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "expired":
        return <AlertCircle className="w-4 h-4 text-orange-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-600" />
      case "jpg":
      case "jpeg":
      case "png":
        return <Image className="w-5 h-5 text-blue-600" />
      case "doc":
      case "docx":
        return <FileType className="w-5 h-5 text-blue-600" />
      case "xlsx":
      case "xls":
        return <File className="w-5 h-5 text-green-600" />
      default:
        return <File className="w-5 h-5 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getOverallProgress = () => {
    const requiredCategories = categories.filter(cat => cat.required)
    const completedCategories = requiredCategories.filter(cat => cat.completionRate === 100)
    return (completedCategories.length / requiredCategories.length) * 100
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Document Management
                </h1>
                <p className="text-gray-600">Upload and manage your account documents</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Verification Progress</h3>
            <span className="text-2xl font-bold text-blue-600">{getOverallProgress().toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  category.completionRate === 100 ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {category.completionRate === 100 ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
                <p className="text-xs text-gray-500">{category.count} document{category.count !== 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Documents
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9"
                  placeholder="Search by name, description, or tags..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="identity">Identity</option>
                <option value="address">Address</option>
                <option value="financial">Financial</option>
                <option value="trading">Trading</option>
                <option value="compliance">Compliance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document Categories */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
                {category.required && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Required</span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-3">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{category.count} docs</span>
                <span className={`text-xs font-medium ${
                  category.completionRate === 100 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {category.completionRate}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Documents List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading documents...</p>
              </div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">Upload your first document to get started.</p>
              <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                <Upload className="w-5 h-5 mr-2" />
                Upload Document
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls"
                />
              </label>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            {getFileIcon(document.format)}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{document.name}</div>
                              {document.isStarred && (
                                <Star className="w-4 h-4 text-yellow-400 ml-2 fill-current" />
                              )}
                              {document.isRequired && (
                                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{document.description}</div>
                            {document.expiryDate && (
                              <div className="text-xs text-orange-600">
                                Expires: {new Date(document.expiryDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {document.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(document.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                            {document.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatFileSize(document.size)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleStar(document.id)}
                            className="text-gray-400 hover:text-yellow-500"
                          >
                            <Star className={`w-4 h-4 ${document.isStarred ? 'text-yellow-400 fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => downloadDocument(document)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-800">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDocument(document.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Uploading Files Indicator */}
          {uploadingFiles.length > 0 && (
            <div className="p-4 bg-blue-50 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-blue-800">
                    Uploading {uploadingFiles.length} file{uploadingFiles.length !== 1 ? 's' : ''}...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Upload ID Document
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>
            
            <label className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Upload Bank Statement
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>
            
            <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300">
              <Archive className="w-5 h-5 mr-2" />
              Archive Old Docs
            </button>
            
            <button className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
              <Download className="w-5 h-5 mr-2" />
              Export All
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}