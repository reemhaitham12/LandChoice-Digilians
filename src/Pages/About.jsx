import React, { useEffect, useState } from 'react';
import {
  Globe, DollarSign, MessageSquare, Mail, MapPin, Send,
  Calendar, CalendarCheck, Zap, Check
} from 'lucide-react';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    category: 'Visa Assistance Services',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const pricingPlans = [
    {
      id: 'monthly',
      icon: Calendar,
      name: 'Monthly',
      price: '$39',
      suffix: '/month',
      note: 'Billed monthly, cancel anytime',
      features: [
        'Post up to 5 active ad listings',
        'Standard placement in search results',
        'Edit or refresh your ads anytime',
        'Email support within 24 hours'
      ]
    },
    {
      id: 'annual',
      icon: CalendarCheck,
      name: 'Annual',
      price: '$200',
      suffix: '/year',
      note: 'Just $29/month, billed once a year',
      badge: 'Best Value · Save 25%',
      highlighted: true,
      features: [
        'Post up to 5 active ad listings',
        'Priority placement above monthly listings',
        'One featured homepage spot per quarter',
        'Priority support with a dedicated contact'
      ]
    },
    {
      id: 'single',
      icon: Zap,
      name: 'Single Ad',
      note: 'One-time payment, no subscription',
      features: [
        'One ad listing live for 30 days',
        'Standard placement in search results',
        'No recurring charges or commitment',
        'Ideal for a one-off promotion'
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://back-end-pro.vercel.app/ad-request/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          companyName: formData.company,  
          category: formData.category,
          message: formData.message,
          plan: selectedPlan
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          category: 'Visa Assistance Services',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 ">
      {/* Pricing Section */}
      <section id="pricing" className="pb-12 sm:pb-16 lg:pb-20 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 p-16">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-semibold tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full mb-3 sm:mb-4">
            ADVERTISING PLANS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Choose How You Advertise</h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed px-2 sm:px-0">
            Subscribe monthly or annually to keep your listings live, or pay once for a single ad.
            Pick a plan below, then send your request to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-3">
          {pricingPlans.map(plan => (
            <PricingCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>
      </section>

      {/* Advertise Section */}
      <section className="pb-12 sm:pb-16 lg:pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Left Side */}
          <div className="pt-4 sm:pt-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-yellow-500 font-bold text-base sm:text-lg">Ad</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Advertise With Us</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-md">
              Reach thousands of active remote workers, digital nomads, and expats looking for housing, flights,
              coworking spaces, tax advisory, or visa assistance.
            </p>

            <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 sm:p-6 max-w-sm">
              <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                Direct Contact Details
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                  <span className="break-all">support@landchoice.com</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                  <span>Customer Service Office (Global Support)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 sm:p-8">
            <h3 className="text-base sm:text-lg font-semibold mb-1">Request an Advertisement</h3>
            <p className="text-gray-400 text-[11px] sm:text-xs mb-4 leading-relaxed">
              Fill out the form below to send your request to our team.
              We will review your offer and get back to you!
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 mb-4 sm:mb-6 gap-2 sm:gap-0">
              <span className="text-xs text-gray-400">
                Selected plan:{" "}
                <span className="text-white font-medium">
                  {pricingPlans.find(p => p.id === selectedPlan)?.name}
                </span>
              </span>
              <button
                type="button"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-blue-400 hover:text-blue-300 transition text-left sm:text-right"
              >
                Change plan
              </button>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs sm:text-sm">
                Your request has been sent successfully! Our team will review it and get back to you shortly.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs sm:text-sm">
                 Failed to send request. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs text-gray-400 mb-1 sm:mb-1.5">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs text-gray-400 mb-1 sm:mb-1.5">Your Email</label>
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs text-gray-400 mb-1 sm:mb-1.5">Company Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Nomad Stay Ltd"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs text-gray-400 mb-1 sm:mb-1.5">Ad Category</label>
                  <select
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500/50 transition appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    disabled={isSubmitting}
                  >
                    <option>Visa Assistance Services</option>
                    <option>Housing & Rentals</option>
                    <option>Coworking Spaces</option>
                    <option>Flights & Travel</option>
                    <option>Tax Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs text-gray-400 mb-1 sm:mb-1.5">Message & Ad Requirements</label>
                <textarea
                  rows={4}
                  placeholder="Describe what services you would like to advertise, duration, and budget requirements..."
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition resize-none"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-medium py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition mt-1 sm:mt-2 text-sm sm:text-base"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {isSubmitting ? 'Sending...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingCard({ plan, selected, onSelect }) {
  const Icon = plan.icon;

  return (
    <div className="relative">
      {plan.badge && (
        <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold text-white bg-gradient-to-r from-[#6C8FD9] to-[#f29706] whitespace-nowrap">
          {plan.badge}
        </div>
      )}

      <div
        onClick={onSelect}
        className={`h-full flex flex-col bg-[#0F172A] border rounded-2xl p-4 sm:p-6 cursor-pointer transition ${
          selected
            ? 'border-blue-500/60 ring-1 ring-blue-500/30'
            : 'border-white/5 hover:border-white/10'
        }`}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 sm:mb-4">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </div>

        <h3 className="text-sm sm:text-base font-semibold mb-1">{plan.name}</h3>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl sm:text-3xl font-bold">{plan.price || ''}</span>
          <span className="text-gray-400 text-xs sm:text-sm">{plan.suffix || ''}</span>
        </div>
        <p className="text-gray-500 text-[10px] sm:text-xs mb-4 sm:mb-5">{plan.note}</p>

        <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onSelect}
          className={`w-full py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition ${
            selected
              ? 'bg-blue-500 text-white'
              : 'bg-[#1E293B] text-gray-300 border border-white/10 hover:border-white/20'
          }`}
        >
          {selected ? 'Selected' : 'Contact Us'}
        </button>
      </div>
    </div>
  );
}