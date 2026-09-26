import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, Truck, RotateCcw, 
  CreditCard, Sparkles, ChevronRight, Phone, Mail, MapPin, User as UserIcon
} from 'lucide-react';
import { ProductModel } from '../types';
import { productsData } from '../data';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
  darkMode: boolean;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  initialProductId = "iphone-18-pro",
  darkMode
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId);
  const selectedProduct = productsData.find(p => p.id === selectedProductId) || productsData[0];
  
  const [selectedColor, setSelectedColor] = useState<string>(selectedProduct.colors[0]?.name || "");
  const [selectedStorageIdx, setSelectedStorageIdx] = useState<number>(0);
  const [tradeInActive, setTradeInActive] = useState<boolean>(false);
  const [tradeInModel, setTradeInModel] = useState<string>("iPhone 15 Pro Max (até 420 €)");
  
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'monthly24'>('full');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lisboa');
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'store'>('home');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Sync color when product changes
  React.useEffect(() => {
    setSelectedColor(selectedProduct.colors[0]?.name || "");
    setSelectedStorageIdx(0);
  }, [selectedProductId]);

  if (!isOpen) return null;

  const storageExtra = selectedProduct.storageOptions[selectedStorageIdx]?.extraPrice || 0;
  const rawTotal = selectedProduct.priceStartingAt + storageExtra;
  const tradeInDeduction = tradeInActive ? 350 : 0;
  const finalTotal = Math.max(0, rawTotal - tradeInDeduction);
  const monthlyRate = (finalTotal / 24).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `PT-AAPL-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedCode(randomCode);
  };

  const resetAndClose = () => {
    setSubmittedCode(null);
    onClose();
  };

  return (
    <div id="reservation-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/70 animate-in fade-in duration-200">
      <div 
        id="reservation-modal-container"
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col ${
          darkMode ? 'bg-[#0f1015] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-100 bg-slate-50/70'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl"></span>
            <div>
              <h3 id="reservation-modal-title" className="font-bold text-lg leading-tight">
                {submittedCode ? "Reserva Confirmada com Prioridade" : "Configurador & Reserva Oficial Portugal"}
              </h3>
              <p className="text-xs text-slate-400">
                {submittedCode ? "Voucher de levantamento e comprovativo digital gerado" : "Garante entrega prioritária a partir de 18 de setembro de 2026"}
              </p>
            </div>
          </div>
          <button 
            id="close-reservation-modal-btn"
            onClick={resetAndClose}
            className={`p-2 rounded-full border transition ${
              darkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {submittedCode ? (
            <div id="reservation-success-view" className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1 rounded-full">
                  Prioridade Garantida • Lote 1
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold mt-3">
                  Parabéns, {fullName || "Cliente"}!
                </h4>
                <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
                  A sua pré-reserva para o <span className="font-semibold text-slate-200">{selectedProduct.name} ({selectedColor})</span> foi registada com sucesso na Apple Portugal.
                </p>
              </div>

              {/* Voucher Card */}
              <div className={`p-6 rounded-2xl border text-left max-w-md mx-auto space-y-3 font-mono text-xs ${
                darkMode ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                <div className="flex justify-between pb-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Código de Reserva:</span>
                  <span className="font-bold text-rose-400">{submittedCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dispositivo:</span>
                  <span className="font-semibold">{selectedProduct.name} ({selectedProduct.storageOptions[selectedStorageIdx]?.size})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Acabamento:</span>
                  <span>{selectedColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Método de Entrega:</span>
                  <span>{deliveryMethod === 'home' ? `Envio Expresso para ${city}` : `Levantamento Apple Store (${city})`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-700/50 font-bold text-sm">
                  <span className="text-slate-300">Valor Estimado:</span>
                  <span className="text-emerald-400">{paymentPlan === 'monthly24' ? `${monthlyRate} €/mês (24x)` : `${finalTotal} €`}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  id="done-reservation-btn"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-slate-100 text-slate-950 font-bold text-sm hover:bg-white transition"
                >
                  Concluir e Voltar à Página
                </button>
              </div>
            </div>
          ) : (
            <form id="reservation-configurator-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Product Selector Tabs */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  1. Selecionar Dispositivo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {productsData.map((p) => {
                    const isSelected = p.id === selectedProductId;
                    return (
                      <button
                        type="button"
                        id={`select-product-${p.id}`}
                        key={p.id}
                        onClick={() => setSelectedProductId(p.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/10 text-rose-300 font-semibold shadow-sm'
                            : darkMode
                              ? 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-medium truncate">{p.name}</span>
                        <span className="text-[10px] mt-1 text-slate-500">Desde {p.priceStartingAt} €</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color & Storage Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Color Selection */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    2. Acabamento: <span className="text-slate-200 font-semibold">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    {selectedProduct.colors.map((c) => (
                      <button
                        type="button"
                        id={`select-color-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-9 h-9 rounded-full border-2 transition flex items-center justify-center ${
                          selectedColor === c.name
                            ? 'ring-2 ring-offset-2 ring-rose-400 border-white scale-110'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor === c.name && (
                          <Check className={`w-4 h-4 ${c.hex === '#ffffff' || c.hex === '#e5e5ea' ? 'text-slate-900' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage / Configuration */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    3. Capacidade & Formato
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.storageOptions.map((opt, idx) => (
                      <button
                        type="button"
                        id={`select-storage-${idx}`}
                        key={opt.size}
                        onClick={() => setSelectedStorageIdx(idx)}
                        className={`p-2.5 rounded-xl border text-xs text-center transition ${
                          selectedStorageIdx === idx
                            ? 'border-rose-500 bg-rose-500/10 font-bold text-rose-300'
                            : darkMode
                              ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <p>{opt.size}</p>
                        {opt.extraPrice > 0 && (
                          <span className="text-[10px] text-slate-500">+{opt.extraPrice} €</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apple Trade In Toggle */}
              <div className={`p-4 rounded-2xl border transition ${
                tradeInActive 
                  ? 'border-emerald-500/40 bg-emerald-950/20' 
                  : darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Tem um dispositivo para retoma (Apple Trade In)?</h4>
                      <p className="text-xs text-slate-400">Poupe até 350 € com desconto imediato deduzido na sua reserva.</p>
                    </div>
                  </div>
                  <input
                    id="tradein-checkbox"
                    type="checkbox"
                    checked={tradeInActive}
                    onChange={(e) => setTradeInActive(e.target.checked)}
                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Personal Details & Location */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  4. Dados para Envio / Notificação de Lançamento
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      id="reservation-fullname"
                      type="text"
                      required
                      placeholder="Nome Completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none focus:border-rose-500 transition ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <input
                      id="reservation-email"
                      type="email"
                      required
                      placeholder="Endereço de E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none focus:border-rose-500 transition ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <input
                      id="reservation-phone"
                      type="tel"
                      required
                      placeholder="Contacto Telefónico (+351)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none focus:border-rose-500 transition ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <select
                      id="reservation-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none focus:border-rose-500 transition ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Lisboa">Lisboa & Vale do Tejo</option>
                      <option value="Porto">Porto & Grande Porto</option>
                      <option value="Braga">Braga & Minho</option>
                      <option value="Coimbra">Coimbra & Centro</option>
                      <option value="Faro">Faro & Algarve</option>
                      <option value="Funchal">Funchal (Madeira)</option>
                      <option value="Ponta Delgada">Ponta Delgada (Açores)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery Preference */}
              <div className="flex items-center gap-4 text-xs">
                <label className="font-semibold text-slate-400">Modalidade:</label>
                <button
                  type="button"
                  id="delivery-home-btn"
                  onClick={() => setDeliveryMethod('home')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                    deliveryMethod === 'home'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-300 font-semibold'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" /> Entrega Gratuita ao Domicílio
                </button>
                <button
                  type="button"
                  id="delivery-store-btn"
                  onClick={() => setDeliveryMethod('store')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                    deliveryMethod === 'store'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-300 font-semibold'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" /> Levantamento na Apple Store
                </button>
              </div>

              {/* Price Calculation Summary & Submit Button */}
              <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Previsto com IVA</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{finalTotal} €</span>
                    {tradeInActive && (
                      <span className="text-xs line-through text-slate-500">{rawTotal} €</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ou em 24x de <span className="text-slate-200 font-semibold">{monthlyRate} €/mês</span> sem juros (TAEG 0%)
                  </p>
                </div>

                <button
                  id="confirm-reservation-submit-btn"
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-100 text-slate-950 font-bold text-sm hover:bg-white transition transform hover:scale-105 shadow-xl shadow-rose-950/30 flex items-center justify-center gap-2"
                >
                  <span>Confirmar Pré-Reserva Grátis</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Notes */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/40">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 3 Anos de Garantia UE
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-400" /> Sem custos de cancelamento
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-purple-400" /> Devolução em 14 dias
                </span>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
