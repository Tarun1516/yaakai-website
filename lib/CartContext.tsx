"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type React from "react"
import { useAuth } from "./AuthContext"

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "id">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { user } = useAuth()

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = localStorage.getItem(`cart-${user?.id || "guest"}`)
        if (storedCart) {
          setCartItems(JSON.parse(storedCart))
        }
      } catch (error) {
        console.error("Error loading cart:", error)
      } finally {
        setIsInitialized(true)
      }
    }

    loadCart()
  }, [user?.id])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(`cart-${user?.id || "guest"}`, JSON.stringify(cartItems))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [cartItems, isInitialized, user?.id])

  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    // Check if item already exists in cart
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.productId === item.productId)

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        )
      } else {
        // Add new item
        return [...prevItems, { ...item, id: `item-${Date.now()}` }]
      }
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const clearCart = useCallback(() => {
    console.log("Clearing cart")
    setCartItems([])
    try {
      localStorage.removeItem(`cart-${user?.id || "guest"}`)
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error)
    }
  }, [user?.id])

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
