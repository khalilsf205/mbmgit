'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart_context';
import { Button } from '@/components/ui/button';

export function CartSidebar() {
  const router = useRouter();
  const { items, removeFromCart, isOpen, closeSidebar } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (prix:any) => {
    if (typeof prix === 'number') {
      return Number(prix.toFixed(2));
    }
    return 0;
  };

  const totalPrice = items.reduce((total, item) => {
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return total + itemQuantity * item.article.prix;
  }, 0);

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting order with items:', items);
      const response = await fetch('/api/submit_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
        credentials: 'include', // Ensure cookies are sent with the request
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        alert('Votre commande a été envoyée avec succès!');
        closeSidebar();
      } else {
        throw new Error(data.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Une erreur est survenue lors de l'envoi de la commande: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Panier</h2>
        <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {items.map((item) => (
              <li key={item.article.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.article.nom}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {Number(formatPrice(Number(item.article.prix)))} TND
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.article.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t pt-4 mb-6">
            <p className="text-xl font-bold">Total: {Number(formatPrice(totalPrice))} TND</p>
          </div>

          <Button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Traitement...
              </div>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Commander
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
