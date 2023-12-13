/** @format */

function formatPrice(price) {
  return String(price).replace(/\B(?=(\d{3})+$)/g)
}
