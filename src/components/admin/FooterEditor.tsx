// Complete Footer Editor Component for Admin Panel

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2 } from 'lucide-react';

export function FooterEditor({ siteConfig, updateSiteConfig }: any) {
  const [editedConfig, setEditedConfig] = useState(siteConfig);

  const handleSave = () => {
    updateSiteConfig(editedConfig);
    alert('Footer settings saved successfully!');
  };

  const updateProductLink = (index: number, field: 'label' | 'href', value: string) => {
    const newLinks = [...editedConfig.footer.sections.products.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEditedConfig({
      ...editedConfig,
      footer: {
        ...editedConfig.footer,
        sections: {
          ...editedConfig.footer.sections,
          products: {
            ...editedConfig.footer.sections.products,
            links: newLinks
          }
        }
      }
    });
  };

  const updateCompanyLink = (index: number, field: 'label' | 'href', value: string) => {
    const newLinks = [...editedConfig.footer.sections.company.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEditedConfig({
      ...editedConfig,
      footer: {
        ...editedConfig.footer,
        sections: {
          ...editedConfig.footer.sections,
          company: {
            ...editedConfig.footer.sections.company,
            links: newLinks
          }
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Footer Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSave}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save All Changes
        </motion.button>
      </div>

      {/* Company Info */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Company Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
          <input
            type="text"
            value={editedConfig.footer.companyName}
            onChange={(e) => setEditedConfig({
              ...editedConfig,
              footer: { ...editedConfig.footer, companyName: e.target.value }
            })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company Description</label>
          <textarea
            value={editedConfig.footer.description}
            onChange={(e) => setEditedConfig({
              ...editedConfig,
              footer: { ...editedConfig.footer, description: e.target.value }
            })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Bottom Text</label>
          <input
            type="text"
            value={editedConfig.footer.bottomText}
            onChange={(e) => setEditedConfig({
              ...editedConfig,
              footer: { ...editedConfig.footer, bottomText: e.target.value }
            })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={editedConfig.footer.contact.email}
              onChange={(e) => setEditedConfig({
                ...editedConfig,
                footer: {
                  ...editedConfig.footer,
                  contact: { ...editedConfig.footer.contact, email: e.target.value }
                }
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
            <input
              type="tel"
              value={editedConfig.footer.contact.phone}
              onChange={(e) => setEditedConfig({
                ...editedConfig,
                footer: {
                  ...editedConfig.footer,
                  contact: { ...editedConfig.footer.contact, phone: e.target.value }
                }
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
            <input
              type="text"
              value={editedConfig.footer.contact.address}
              onChange={(e) => setEditedConfig({
                ...editedConfig,
                footer: {
                  ...editedConfig.footer,
                  contact: { ...editedConfig.footer.contact, address: e.target.value }
                }
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Social Media Links</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Twitter URL</label>
            <input
              type="url"
              value={editedConfig.footer.socialLinks.twitter}
              onChange={(e) => setEditedConfig({
                ...editedConfig,
                footer: {
                  ...editedConfig.footer,
                  socialLinks: { ...editedConfig.footer.socialLinks, twitter: e.target.value }
                }
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={editedConfig.footer.socialLinks.linkedin}
              onChange={(e) => setEditedConfig({
                ...editedConfig,
                footer: {
                  ...editedConfig.footer,
                  socialLinks: { ...editedConfig.footer.socialLinks, linkedin: e.target.value }
                }
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
            <input
              type="url"
              value={editedConfig.footer.socialLinks.github}
              onChange={(e) => setEditedConfig({
                ...editedConfig,
                footer: {
                  ...editedConfig.footer,
                  socialLinks: { ...editedConfig.footer.socialLinks, github: e.target.value }
                }
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Product Links */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Product Links Section</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Section Title</label>
          <input
            type="text"
            value={editedConfig.footer.sections.products.title}
            onChange={(e) => setEditedConfig({
              ...editedConfig,
              footer: {
                ...editedConfig.footer,
                sections: {
                  ...editedConfig.footer.sections,
                  products: { ...editedConfig.footer.sections.products, title: e.target.value }
                }
              }
            })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white mb-4"
          />
        </div>

        <div className="space-y-3">
          {editedConfig.footer.sections.products.links.map((link: any, index: number) => (
            <div key={index} className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Link Label"
                value={link.label}
                onChange={(e) => updateProductLink(index, 'label', e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Link URL"
                value={link.href}
                onChange={(e) => updateProductLink(index, 'href', e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Company Links */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Company Links Section</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Section Title</label>
          <input
            type="text"
            value={editedConfig.footer.sections.company.title}
            onChange={(e) => setEditedConfig({
              ...editedConfig,
              footer: {
                ...editedConfig.footer,
                sections: {
                  ...editedConfig.footer.sections,
                  company: { ...editedConfig.footer.sections.company, title: e.target.value }
                }
              }
            })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white mb-4"
          />
        </div>

        <div className="space-y-3">
          {editedConfig.footer.sections.company.links.map((link: any, index: number) => (
            <div key={index} className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Link Label"
                value={link.label}
                onChange={(e) => updateCompanyLink(index, 'label', e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Link URL"
                value={link.href}
                onChange={(e) => updateCompanyLink(index, 'href', e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
