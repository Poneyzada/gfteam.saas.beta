'use client'

import { useState, useMemo } from 'react'
import { 
  ShoppingBag, Package, Plus, Search, 
  DollarSign, BarChart3, ArrowUpRight, Minus,
  Info, ShoppingCart, X, CheckCircle, Trash2, Tag
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Product {
  id: number
  name: string
  category: string
  stock: number
  price: number
  description: string
  image?: string
}

interface CartItem {
  product: Product
  quantity: number
}

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewProductModal, setShowNewProductModal] = useState(false)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [showCartDrawer, setShowCartDrawer] = useState(false)

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])

  // Products state (mutable now)
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Kimono GFTeam Gold Edition', category: 'Uniformes', stock: 12, price: 450, description: 'Kimono trançado 450g de alta resistência com patches oficiais bordados.' },
    { id: 2, name: 'Patch Matriz Bordado', category: 'Acessórios', stock: 45, price: 35, description: 'Patch oficial GFTeam para personalização de uniformes e acessórios.' },
    { id: 3, name: 'Whey Protein Isolado', category: 'Suplementos', stock: 3, price: 180, description: 'Suplemento proteico isolado de rápida absorção para recuperação muscular.' },
    { id: 4, name: 'Faixa Preta Premium', category: 'Equipamento', stock: 0, price: 120, description: 'Faixa de alta qualidade com ponteira e bordado personalizado.' },
  ])

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Uniformes', price: '', stock: '', description: ''
  })

  // Entry form state
  const [entryProductId, setEntryProductId] = useState<number | null>(null)
  const [entryQuantity, setEntryQuantity] = useState('')

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }, [products, searchQuery])

  // Cart helpers
  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]
  )
  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0), [cart]
  )

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) return
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`Estoque máximo de ${product.name} atingido!`)
          return prev
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    showToast(`${product.name} adicionado ao carrinho!`)
  }

  const handleRemoveFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const handleCartQtyChange = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id !== productId) return item
      const newQty = item.quantity + delta
      if (newQty <= 0) return item
      if (newQty > item.product.stock) return item
      return { ...item, quantity: newQty }
    }))
  }

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.stock) {
      showToast('Preencha todos os campos obrigatórios!')
      return
    }
    const product: Product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      description: newProduct.description.trim() || 'Sem descrição.'
    }
    setProducts(prev => [...prev, product])
    setNewProduct({ name: '', category: 'Uniformes', price: '', stock: '', description: '' })
    setShowNewProductModal(false)
    showToast(`${product.name} adicionado ao inventário!`)
  }

  const handleStockEntry = () => {
    if (!entryProductId || !entryQuantity || parseInt(entryQuantity) <= 0) {
      showToast('Selecione o produto e a quantidade!')
      return
    }
    const qty = parseInt(entryQuantity)
    setProducts(prev => prev.map(p => 
      p.id === entryProductId ? { ...p, stock: p.stock + qty } : p
    ))
    const prodName = products.find(p => p.id === entryProductId)?.name
    setEntryProductId(null)
    setEntryQuantity('')
    setShowEntryModal(false)
    showToast(`+${qty} unidades de ${prodName} registradas!`)
  }

  // Stats
  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length
  const outOfStockCount = products.filter(p => p.stock === 0).length

  return (
    <div className="p-4 md:p-10 space-y-10 animate-fade-in bg-app min-h-screen text-left relative z-30">
      {/* Toast de Sucesso */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-[500] bg-emerald-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400/20"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-black uppercase text-xs tracking-widest">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">Loja <span className="text-accent-primary italic">GFTeam</span></h1>
          <p className="text-[10px] text-black dark:text-white font-black uppercase tracking-[0.3em] mt-3 opacity-60">Gestão de Inventário e Suprimentos</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button 
            onClick={() => setShowCartDrawer(true)}
            className="relative px-6 py-4 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase text-black dark:text-white hover:bg-surface-700 transition-all cursor-pointer flex items-center gap-3"
          >
            <ShoppingCart className="w-4 h-4" /> CARRINHO
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowEntryModal(true)}
            className="px-6 py-4 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase text-black dark:text-white hover:bg-surface-700 transition-all cursor-pointer flex items-center gap-3"
          >
            <Package className="w-4 h-4" /> ENTRADA
          </button>
          <button 
            onClick={() => setShowNewProductModal(true)}
            className="px-8 py-4 rounded-xl bg-accent-primary text-black text-[10px] font-black uppercase tracking-widest shadow-xl border-none cursor-pointer flex items-center gap-3"
          >
            <Plus className="w-5 h-5 stroke-[3]" /> NOVO PRODUTO
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Produtos Cadastrados', value: String(products.length).padStart(2, '0'), trend: 'Total', icon: ShoppingBag },
          { label: 'Itens no Carrinho', value: String(cartCount).padStart(2, '0'), trend: `R$ ${cartTotal.toFixed(2)}`, icon: ShoppingCart },
          { label: 'Valor em Estoque', value: `R$ ${(totalStockValue / 1000).toFixed(1)}k`, trend: `${products.reduce((s,p)=>s+p.stock,0)} unidades`, icon: Package },
          { label: 'Alertas de Estoque', value: String(lowStockCount + outOfStockCount).padStart(2, '0'), trend: `${outOfStockCount} esgotados`, icon: Tag, color: 'text-red-500' }
        ].map((s, i) => (
          <div key={i} className="kpi-card !p-6 bg-surface-900 border-black/10 dark:border-white/10">
            <div className="flex justify-between items-start mb-4">
               <p className="text-[9px] font-black text-black dark:text-white uppercase tracking-widest opacity-60">{s.label}</p>
               <s.icon className={`w-4 h-4 text-accent-primary ${s.color || ''}`} />
            </div>
            <p className="text-3xl font-display font-black text-black dark:text-white italic tracking-tighter">{s.value}</p>
            <p className="text-[9px] font-black text-accent-primary uppercase mt-2">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="kpi-card !p-0 overflow-hidden bg-surface-900 border-black/10 dark:border-white/10 shadow-2xl relative z-[40]">
        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <h2 className="text-2xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter">Inventário Matriz</h2>
           <div className="flex items-center gap-4 bg-surface-800 rounded-xl px-5 py-3 border border-black/10 w-full md:max-w-xs">
              <Search className="w-4 h-4 text-accent-primary" />
              <input 
                type="text" 
                placeholder="BUSCAR PRODUTO..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[10px] font-black text-black dark:text-white uppercase tracking-widest w-full" 
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-surface-800/50 text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] border-b border-black/10">
                    <th className="p-6">Produto</th>
                    <th className="p-6">Categoria</th>
                    <th className="p-6">Estoque</th>
                    <th className="p-6">Preço</th>
                    <th className="p-6 text-right">Ações</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <p className="text-sm font-black text-black/30 dark:text-white/30 uppercase italic">
                        {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                      </p>
                    </td>
                  </tr>
                ) : filteredProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-accent-primary/5 transition-all group">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center border border-black/10 group-hover:border-accent-primary transition-all">
                             <ShoppingBag className="w-5 h-5 text-accent-primary" />
                          </div>
                          <p className="text-sm font-black text-black dark:text-white uppercase italic">{prod.name}</p>
                       </div>
                    </td>
                    <td className="p-6">
                       <span className="text-[9px] font-black bg-surface-800 text-black dark:text-white px-3 py-1.5 rounded-lg border border-black/10 uppercase">{prod.category}</span>
                    </td>
                    <td className="p-6">
                       <div className="flex flex-col gap-1.5">
                          <span className={`text-[11px] font-black uppercase ${prod.stock === 0 ? 'text-red-500' : prod.stock < 5 ? 'text-amber-500' : 'text-black dark:text-white'}`}>
                            {prod.stock === 0 ? 'ESGOTADO' : `${prod.stock} UN`}
                          </span>
                          <div className="w-16 h-1 bg-surface-800 rounded-full overflow-hidden">
                             <div className={`h-full ${prod.stock === 0 ? 'bg-red-500' : prod.stock < 5 ? 'bg-amber-500' : 'bg-accent-primary'}`} style={{ width: `${Math.min((prod.stock/50)*100, 100)}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <p className="text-sm font-black text-black dark:text-white">R$ {prod.price.toFixed(2)}</p>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setSelectedProduct(prod)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-800 border border-black/10 text-[9px] font-black text-black dark:text-white uppercase tracking-widest hover:border-accent-primary hover:bg-surface-700 transition-all cursor-pointer relative z-50 pointer-events-auto"
                          >
                             <Info className="w-3.5 h-3.5" /> DETALHES
                          </button>
                          <button 
                            onClick={() => handleAddToCart(prod)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-none shadow-lg relative z-50 pointer-events-auto ${prod.stock === 0 ? 'bg-red-500/10 text-red-500 cursor-not-allowed' : 'bg-accent-primary text-black hover:scale-105 active:scale-95'}`} 
                            disabled={prod.stock === 0}
                          >
                             <ShoppingCart className="w-4 h-4" /> ADICIONAR
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* ============================================= */}
      {/* MODAL: Detalhes do Produto */}
      {/* ============================================= */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 border border-black/10 dark:border-white/10 shadow-2xl relative z-[1010] text-left"
            >
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-primary hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-20 h-20 rounded-[2rem] bg-accent-primary flex items-center justify-center text-black mb-8 shadow-xl">
                 <ShoppingBag className="w-10 h-10" />
              </div>
              
              <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.4em] mb-4">Detalhes do Produto</p>
              <h2 className="text-4xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-6">{selectedProduct.name}</h2>
              
              <div className="p-6 bg-surface-900 border border-black/10 dark:border-white/10 rounded-2xl mb-6">
                <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 opacity-60">Categoria</p>
                <p className="text-sm font-bold text-text-primary">{selectedProduct.category}</p>
              </div>

              <div className="p-6 bg-surface-900 border border-black/10 dark:border-white/10 rounded-2xl mb-10">
                <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 opacity-60">Descrição</p>
                <p className="text-sm font-bold text-text-secondary leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-[10px] font-black text-text-secondary opacity-70 uppercase mb-2">Preço Unitário</p>
                  <p className="text-3xl font-display font-black text-text-primary">R$ {selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary opacity-70 uppercase mb-2">Estoque Disponível</p>
                  <p className={`text-3xl font-display font-black ${selectedProduct.stock === 0 ? 'text-red-500' : 'text-emerald-500'}`}>{selectedProduct.stock} Un</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  handleAddToCart(selectedProduct)
                  setSelectedProduct(null)
                }}
                disabled={selectedProduct.stock === 0}
                className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border-none cursor-pointer flex items-center justify-center gap-3 ${selectedProduct.stock === 0 ? 'bg-surface-700 text-text-secondary/25 cursor-not-allowed' : 'bg-accent-primary text-black hover:scale-105 active:scale-95 shadow-xl shadow-accent-primary/20'}`}
              >
                <ShoppingCart className="w-5 h-5" /> {selectedProduct.stock === 0 ? 'INDISPONÍVEL' : 'ADICIONAR AO CARRINHO'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================= */}
      {/* MODAL: Novo Produto */}
      {/* ============================================= */}
      <AnimatePresence>
        {showNewProductModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowNewProductModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 border border-black/10 dark:border-white/10 shadow-2xl relative z-[1010] text-left"
            >
              <button 
                onClick={() => setShowNewProductModal(false)} 
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-primary hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-20 h-20 rounded-[2rem] bg-accent-primary flex items-center justify-center text-black mb-8 shadow-xl">
                 <Plus className="w-10 h-10 stroke-[3]" />
              </div>
              
              <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.4em] mb-4">Cadastrar Produto</p>
              <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-10">Novo Produto</h2>
              
              <div className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 block opacity-60">Nome do Produto *</label>
                  <input 
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: Kimono Competition A4"
                    className="w-full px-5 py-4 rounded-xl bg-surface-900 border border-black/10 dark:border-white/10 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all placeholder:text-text-secondary/30"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 block opacity-60">Categoria</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-5 py-4 rounded-xl bg-surface-900 border border-black/10 dark:border-white/10 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="Uniformes">Uniformes</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Suplementos">Suplementos</option>
                    <option value="Equipamento">Equipamento</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                {/* Preço e Estoque */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 block opacity-60">Preço (R$) *</label>
                    <input 
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))}
                      placeholder="0.00"
                      className="w-full px-5 py-4 rounded-xl bg-surface-900 border border-black/10 dark:border-white/10 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all placeholder:text-text-secondary/30"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 block opacity-60">Estoque Inicial *</label>
                    <input 
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                      placeholder="0"
                      className="w-full px-5 py-4 rounded-xl bg-surface-900 border border-black/10 dark:border-white/10 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all placeholder:text-text-secondary/30"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 block opacity-60">Descrição</label>
                  <textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
                    placeholder="Descrição breve do produto..."
                    rows={3}
                    className="w-full px-5 py-4 rounded-xl bg-surface-900 border border-black/10 dark:border-white/10 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all resize-none placeholder:text-text-secondary/30"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddProduct}
                className="w-full mt-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border-none cursor-pointer flex items-center justify-center gap-3 bg-accent-primary text-black hover:scale-105 active:scale-95 shadow-xl shadow-accent-primary/20"
              >
                <Plus className="w-5 h-5 stroke-[3]" /> ADICIONAR AO INVENTÁRIO
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================= */}
      {/* MODAL: Entrada de Estoque */}
      {/* ============================================= */}
      <AnimatePresence>
        {showEntryModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowEntryModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 border border-black/10 dark:border-white/10 shadow-2xl relative z-[1010] text-left"
            >
              <button 
                onClick={() => setShowEntryModal(false)} 
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-primary hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-20 h-20 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white mb-8 shadow-xl">
                 <Package className="w-10 h-10" />
              </div>
              
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">Registro de Entrada</p>
              <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-10">Entrada de Estoque</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 block opacity-60">Selecione o Produto</label>
                  <select 
                    value={entryProductId || ''}
                    onChange={(e) => setEntryProductId(Number(e.target.value))}
                    className="w-full px-5 py-4 rounded-xl bg-surface-900 border border-black/10 dark:border-white/10 text-sm font-bold text-text-primary outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Escolha um produto...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Atual: {p.stock} un)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 block opacity-60">Quantidade Recebida</label>
                  <input 
                    type="number"
                    min="1"
                    value={entryQuantity}
                    onChange={(e) => setEntryQuantity(e.target.value)}
                    placeholder="Quantas unidades chegaram?"
                    className="w-full px-5 py-4 rounded-xl bg-surface-900 border border-black/10 dark:border-white/10 text-sm font-bold text-text-primary outline-none focus:border-emerald-500 transition-all placeholder:text-text-secondary/30"
                  />
                </div>
              </div>

              <button 
                onClick={handleStockEntry}
                className="w-full mt-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border-none cursor-pointer flex items-center justify-center gap-3 bg-emerald-500 text-white hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
              >
                <Package className="w-5 h-5" /> REGISTRAR ENTRADA
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================= */}
      {/* DRAWER: Carrinho */}
      {/* ============================================= */}
      <AnimatePresence>
        {showCartDrawer && (
          <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center md:justify-end">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCartDrawer(false)} />
            <motion.div 
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-surface-800 w-full md:w-[480px] h-[85vh] md:h-full md:max-h-screen rounded-t-[3rem] md:rounded-none border-l border-black/10 dark:border-white/10 shadow-2xl relative z-[1010] flex flex-col"
            >
              {/* Cart Header */}
              <div className="p-8 border-b border-black/10 dark:border-white/10 flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.4em] mb-2">Carrinho</p>
                  <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter">
                    {cartCount} {cartCount === 1 ? 'Item' : 'Itens'}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowCartDrawer(false)} 
                  className="w-12 h-12 rounded-full bg-surface-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-primary hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30">
                    <ShoppingCart className="w-16 h-16 text-text-muted mb-4" />
                    <p className="text-sm font-black text-text-muted uppercase italic">Carrinho vazio</p>
                  </div>
                ) : cart.map(item => (
                  <div key={item.product.id} className="p-5 bg-surface-900 rounded-2xl border border-black/10 dark:border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-text-primary uppercase italic truncate">{item.product.name}</p>
                          <p className="text-[9px] font-bold text-text-muted uppercase">{item.product.category}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer flex-shrink-0 border-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleCartQtyChange(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center border-none transition-all cursor-pointer ${item.quantity <= 1 ? 'bg-surface-800 text-text-muted/30 cursor-not-allowed' : 'bg-surface-800 text-text-primary hover:bg-accent-primary hover:text-black'}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-black text-text-primary w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleCartQtyChange(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center border-none transition-all cursor-pointer ${item.quantity >= item.product.stock ? 'bg-surface-800 text-text-muted/30 cursor-not-allowed' : 'bg-surface-800 text-text-primary hover:bg-accent-primary hover:text-black'}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-black text-accent-primary">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-8 border-t border-black/10 dark:border-white/10 flex-shrink-0">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-60">Total</p>
                    <p className="text-3xl font-display font-black text-text-primary italic tracking-tighter">R$ {cartTotal.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => {
                      // Deduct stock
                      setProducts(prev => prev.map(p => {
                        const cartItem = cart.find(c => c.product.id === p.id)
                        if (cartItem) return { ...p, stock: p.stock - cartItem.quantity }
                        return p
                      }))
                      setCart([])
                      setShowCartDrawer(false)
                      showToast('Venda registrada com sucesso!')
                    }}
                    className="w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border-none cursor-pointer flex items-center justify-center gap-3 bg-accent-primary text-black hover:scale-105 active:scale-95 shadow-xl shadow-accent-primary/20"
                  >
                    <DollarSign className="w-5 h-5" /> FINALIZAR VENDA
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
