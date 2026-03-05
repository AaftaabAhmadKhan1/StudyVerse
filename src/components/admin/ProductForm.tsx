import { getCategories, updateCategories } from '@/data/siteConfig';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Save } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function ProductForm({ product, onSave, onCancel, isEditing = false }: ProductFormProps) {
  // Admin editable categories state
  const [categories, setCategories] = useState<string[]>(typeof window !== 'undefined' ? getCategories() : ['All', 'Booking', 'Delivery', 'E-Commerce', 'Communication', 'Custom']);
  const [newCategory, setNewCategory] = useState('');

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updated = [...categories, newCategory.trim()];
      setCategories(updated);
      updateCategories(updated);
      setNewCategory('');
    }
  };

  // Rename category
  const handleRenameCategory = (index: number, value: string) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
    updateCategories(updated);
  };

  // Remove category
  const handleRemoveCategory = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    updateCategories(updated);
  };

  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    price: 0,
    image: '',
    images: ['', '', '', ''],
    category: 'Custom',
    rating: 5,
    reviews: 0,
    description: '',
    detailedDescription: '',
    inStock: true,
    features: [''],
    technologies: [''],
    demoUrl: '',
    support: '24/7 Support',
    deliveryTime: '3-5 business days',
    updates: 'Free updates for 1 year',
    platforms: ['Web'],
  });

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_: string, i: number) => i !== index)
    });
  };

  const addTechnology = () => {
    setFormData({
      ...formData,
      technologies: [...(formData.technologies || []), '']
    });
  };

  const updateTechnology = (index: number, value: string) => {
    const newTech = [...(formData.technologies || [])];
    newTech[index] = value;
    setFormData({ ...formData, technologies: newTech });
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: (formData.technologies || []).filter((_: string, i: number) => i !== index)
    });
  };

  const addPlatform = () => {
    setFormData({
      ...formData,
      platforms: [...(formData.platforms || []), '']
    });
  };

  const updatePlatform = (index: number, value: string) => {
    const newPlatforms = [...(formData.platforms || [])];
    newPlatforms[index] = value;
    setFormData({ ...formData, platforms: newPlatforms });
  };

  const removePlatform = (index: number) => {
    setFormData({
      ...formData,
      platforms: (formData.platforms || []).filter((_: string, i: number) => i !== index)
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...(formData.images || ['', '', '', ''])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = () => {
    // Clean up empty arrays
    const cleanedData = {
      ...formData,
      features: (formData.features || []).filter((f: string) => f.trim() !== ''),
      technologies: (formData.technologies || []).filter((t: string) => t.trim() !== ''),
      platforms: (formData.platforms || []).filter((p: string) => p.trim() !== ''),
      images: (formData.images || []).filter((img: string) => img.trim() !== ''),
    };
    onSave(cleanedData);
  };

  return (
    <>
      {/* Admin Category Editor */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-xl rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Edit Categories</h3>
        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <div key={cat} className="flex items-center gap-2">
              <input
                type="text"
                value={cat}
                onChange={e => handleRenameCategory(idx, e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white flex-1"
              />
              <button
                onClick={() => handleRemoveCategory(idx)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400"
                disabled={categories.length <= 1}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white flex-1"
            placeholder="Add new category"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-semibold"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-xl rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {isEditing ? `Edit Product${product?.id ? ` (ID: ${product.id})` : ''}` : 'Create New Product'}
          </h3>
          {isEditing && product?.id && (
            <p className="text-sm text-slate-400 mb-4">Product ID is automatically assigned and cannot be changed</p>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price ($) *</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
              <select
                value={formData.category || 'Custom'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Stock Status</label>
              <select
                value={formData.inStock ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.value === 'true' })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Reviews</label>
              <input
                type="number"
                value={formData.reviews || 0}
                onChange={(e) => setFormData({ ...formData, reviews: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Short Description *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white h-20 resize-none"
                placeholder="Brief product description for listing pages"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Description</label>
              <textarea
                value={formData.detailedDescription || ''}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white h-32 resize-none"
                placeholder="Complete product description for product detail page"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Main Image URL *</label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-slate-300 mb-2">Gallery Image {index + 1}</label>
                <input
                  type="text"
                  value={(formData.images || [])[index] || ''}
                  onChange={(e) => updateImage(index, e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Product Details</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Support</label>
              <input
                type="text"
                value={formData.support || ''}
                onChange={(e) => setFormData({ ...formData, support: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="24/7 Priority Support"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Delivery Time</label>
              <input
                type="text"
                value={formData.deliveryTime || ''}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="3-5 business days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Updates Policy</label>
              <input
                type="text"
                value={formData.updates || ''}
                onChange={(e) => setFormData({ ...formData, updates: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Free updates for 1 year"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Demo URL (optional)</label>
              <input
                type="url"
                value={formData.demoUrl || ''}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="https://demo.example.com"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Features</h4>
            <button
              onClick={addFeature}
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>
          <div className="space-y-2">
            {(formData.features || ['']).map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Enter feature"
                />
                {(formData.features || []).length > 1 && (
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Technologies Used</h4>
            <button
              onClick={addTechnology}
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Technology
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-2">
            {(formData.technologies || ['']).map((tech: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => updateTechnology(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="React, Node.js..."
                />
                {(formData.technologies || []).length > 1 && (
                  <button
                    onClick={() => removeTechnology(index)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Available Platforms</h4>
            <button
              onClick={addPlatform}
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Platform
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-2">
            {(formData.platforms || ['Web']).map((platform: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => updatePlatform(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="iOS, Android, Web..."
                />
                {(formData.platforms || []).length > 1 && (
                  <button
                    onClick={() => removePlatform(index)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2 font-semibold"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Save Changes' : 'Create Product'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onCancel}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg"
          >
            Cancel
          </motion.button>
          {!isEditing && (
            <p className="text-sm text-slate-400 ml-4">
              Product ID will be automatically generated
            </p>
          )}
        </div>
      </div>
    </>
  );
}
