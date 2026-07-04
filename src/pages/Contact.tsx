import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-24 pb-20">
      <section className="bg-merveille-dark py-20 md:py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20" alt="Contact Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">Contactez <span className="text-merveille-orange">L'Équipe</span></h1>
          <p className="text-white/50 max-w-2xl mx-auto font-light text-lg px-4 leading-relaxed">Nous sommes à votre écoute pour concrétiser vos ambitions immobilières.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Info cards */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            {[
              { icon: MapPin, title: 'Adresse', val: 'DIAMAGUENE 2, M\'Bour, Sénégal' },
              { icon: Phone, title: 'Téléphones', val: '+221 77 710 80 33 / +221 75 001 10 00' },
              { icon: Mail, title: 'Email', val: 'sambaddiop1@gmail.com' },
              { icon: Clock, title: 'Heures de Bureau', val: 'Lun - Sam: 08h00 - 18h00' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl flex items-center space-x-6 border border-gray-100 transition-transform hover:scale-[1.02]">
                <div className="bg-merveille-orange/10 p-4 rounded-2xl shrink-0">
                  <item.icon className="h-6 w-6 text-merveille-orange" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.title}</h4>
                  <p className="text-sm font-bold text-merveille-dark">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-8 md:p-16 border border-gray-100">
            <div className="flex items-center space-x-4 mb-8 md:mb-10">
              <MessageSquare className="h-8 w-8 text-merveille-orange" />
              <h2 className="text-2xl md:text-3xl font-black">Envoyez un message</h2>
            </div>
            
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom Complet</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Objet</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message</label>
                <textarea rows={6} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 outline-none transition-all resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>
              <button className="btn-primary w-full py-5 flex items-center justify-center">
                ENVOYER LE MESSAGE <Send className="ml-3 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[40px] overflow-hidden h-[500px] shadow-2xl border border-gray-100">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15478.411603588915!2d-16.9691888!3d14.4172465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee923485f7ea1cb%3A0xe10e9f0d1a6f874d!2sDiamaguene%2C%20Mbour!5e0!3m2!1sen!2ssn!4v1715170000000!5m2!1sen!2ssn" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
