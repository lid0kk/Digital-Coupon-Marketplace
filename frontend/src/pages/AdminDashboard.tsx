import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api';
import { PlusCircle, Trash2, Tag, Percent, DollarSign } from 'lucide-react';

interface AdminProduct {
    id: string;
    name: string;
    description: string;
    image_url: string;
    cost_price: string;
    margin_percentage: string;
    minimum_sell_price: number;
    is_sold: boolean;
    value: string;
}

const AdminDashboard = () => {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        cost_price: '',
        margin_percentage: '',
        value: ''
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/admin/products');
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete product');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            const payload = {
                ...formData,
                cost_price: parseFloat(formData.cost_price),
                margin_percentage: parseFloat(formData.margin_percentage)
            };

            await api.post('/admin/products', payload);
            setShowForm(false);
            setFormData({ name: '', description: '', image_url: '', cost_price: '', margin_percentage: '', value: '' });
            fetchProducts();
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between bg-white px-6 py-5 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage marketplace products and pricing rules.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>{showForm ? 'Cancel' : 'New Product'}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Create New Coupon</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                                {formError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">Product Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                    placeholder="e.g. Amazon $100 Gift Card"
                                />
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                                    placeholder="A brief description of this coupon"
                                />
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">Image URL</label>
                                <input
                                    required
                                    type="url"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-gray-400" /> Cost Price
                                </label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.cost_price}
                                    onChange={e => setFormData({ ...formData, cost_price: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                    placeholder="80.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                    <Percent className="w-4 h-4 text-gray-400" /> Margin %
                                </label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.margin_percentage}
                                    onChange={e => setFormData({ ...formData, margin_percentage: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                    placeholder="25.00"
                                />
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                    <Tag className="w-4 h-4 text-gray-400" /> Secret Coupon Value
                                </label>
                                <input
                                    required
                                    value={formData.value}
                                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-mono"
                                    placeholder="ABCD-1234-EFGH-5678"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                            >
                                {formLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Create Coupon'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cost / Margin</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sell Price</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No products created yet.
                                    </td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-lg object-cover bg-gray-100 border border-gray-200" src={product.image_url} alt="" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800'; }} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500 font-mono truncate w-32 border px-1 py-0.5 mt-1 rounded bg-gray-50">{product.value}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${parseFloat(product.cost_price).toFixed(2)}</div>
                                        <div className="text-xs text-brand-600 font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded inline-block mt-1">
                                            {parseFloat(product.margin_percentage).toFixed(0)}% Margin
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                            ${product.minimum_sell_price.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {product.is_sold ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Sold
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                Available
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
