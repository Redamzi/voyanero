"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ImpressumPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-slate-900 mb-8">Impressum</h1>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Firmeninformationen</h2>
                        <p className="text-slate-700 leading-relaxed">
                            <strong>Voyanero.com</strong><br />
                            Einzelunternehmen<br />
                            Kielstraße 28<br />
                            44145 Dortmund<br />
                            Deutschland
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Kontakt</h2>
                        <p className="text-slate-700 leading-relaxed">
                            E-Mail: <a href="mailto:support@voyanero.com" className="text-orange-600 hover:text-orange-700">support@voyanero.com</a>
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Verantwortlich für den Inhalt nach § 18 MStV</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Westagentur Inhaber<br />
                            Kielstraße 28<br />
                            44145 Dortmund
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Haftungsausschluss</h2>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Haftung für Inhalte</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                            nach den allgemeinen Gesetzen verantwortlich.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Haftung für Links</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
                            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
                            Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
                            Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Affiliate-Hinweis</h3>
                        <p className="text-slate-700 leading-relaxed">
                            Voyanero.com ist ein Reise-Vergleichsportal und arbeitet mit verschiedenen Partner-Plattformen
                            zusammen. Bei Buchungen über unsere Links erhalten wir eine Provision. Für Sie entstehen dadurch
                            keine zusätzlichen Kosten. Die Preise sind identisch mit denen auf den Partner-Websites.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Urheberrecht</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                            deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
                            außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
                            Autors bzw. Erstellers.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
