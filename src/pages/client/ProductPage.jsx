import React from 'react'
import { Navigate, useParams, useOutletContext } from 'react-router-dom'
import { getProductById } from '../../data/products'

// Redirect to customize page (product page is the customization page)
export default function ProductPage() {
  const { productId } = useParams()
  const { getSalonParam } = useOutletContext()
  const product = getProductById(productId)

  if (!product) {
    return <Navigate to={`/${getSalonParam()}`} replace />
  }

  return <Navigate to={`/personnaliser/${productId}${getSalonParam()}`} replace />
}
