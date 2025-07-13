// Cloudinary upload utility
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // Create FormData for upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'liveapp_preset') // Replace with your preset
    formData.append('cloud_name', 'your_cloud_name') // Replace with your cloud name
    
    // Upload to Cloudinary
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your cloud name
      {
        method: 'POST',
        body: formData
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary')
    }
    
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Image upload failed')
  }
}

// Alternative: Upload to your own server
export const uploadImageToServer = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('/api/v1/upload/image', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image to server')
    }
    
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Server upload error:', error)
    throw new Error('Image upload failed')
  }
}

// Mock upload for development
export const mockImageUpload = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a mock URL
      resolve(`https://via.placeholder.com/640x360?text=${encodeURIComponent(file.name)}`)
    }, 1000)
  })
} 