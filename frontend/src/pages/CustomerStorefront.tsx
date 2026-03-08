import { useEffect, useState } from 'react';
import api from '../api';
import { Tag, CheckCircle2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
}

interface PurchaseResult {
    product_id: string;
    final_price: number;
    value_type: string;
    value: string;
}

const CustomerStorefront = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasedProduct, setPurchasedProduct] = useState<PurchaseResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/store/products');
            setProducts(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        setPurchasingId(productId);
        setError(null);
        try {
            const { data } = await api.post(`/store/products/${productId}/purchase`);
            setPurchasedProduct(data);
            // Remove from list
            setProducts(products.filter(p => p.id !== productId));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to purchase');
        } finally {
            setPurchasingId(null);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Digital Marketplace</h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-500">Discover and purchase premium digital coupons instantly.</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {purchasedProduct && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                    <h2 className="text-2xl font-bold text-green-800">Purchase Successful!</h2>
                    <div className="bg-white px-6 py-4 rounded-lg border border-green-100 shadow-sm w-full max-w-md text-center">
                        <p className="text-sm tracking-wider text-gray-500 uppercase mb-2">Your Secret Code</p>
                        <p className="text-3xl font-mono font-bold text-gray-900 break-all">{purchasedProduct.value}</p>
                    </div>
                    <button
                        onClick={() => setPurchasedProduct(null)}
                        className="mt-4 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors font-medium"
                    >
                        Continue Shopping
                    </button>
                </div>
            )}

            {!purchasedProduct && (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-500 font-medium">No coupons available right now.</p>
                            <p className="text-gray-400 mt-2">Check back later for new deals!</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden h-48">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800'; }}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm font-bold text-gray-900 border border-white/20">
                                        ${product.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>

                                    <button
                                        onClick={(e) => handlePurchase(e, product.id)}
                                        disabled={purchasingId === product.id}
                                        className="w-full relative flex justify-center items-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        {purchasingId === product.id ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            'Purchase Now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerStorefront;
