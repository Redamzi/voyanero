"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AGBPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-slate-900 mb-8">Allgemeine Geschäftsbedingungen</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 mb-8"><strong>Stand:</strong> Januar 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 1 Geltungsbereich</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Website Voyanero.com
                            (nachfolgend "Plattform") durch den Nutzer. Voyanero.com ist ein Reise-Vergleichsportal, das
                            Angebote verschiedener Reiseanbieter aggregiert und dem Nutzer zur Verfügung stellt.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 2 Vertragsgegenstand</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Voyanero.com bietet folgende Leistungen:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Vergleich von Hotel-, Flug- und Reiseangeboten</li>
                            <li>Weiterleitung zu Buchungsplattformen (z.B. Booking.com, GetYourGuide)</li>
                            <li>Bereitstellung von Reiseinformationen und Empfehlungen</li>
                            <li>KI-gestützte Suchfunktionen</li>
                        </ul>
                        <p className="text-slate-700 leading-relaxed mt-4">
                            <strong>Wichtig:</strong> Voyanero.com ist <u>kein Reiseveranstalter</u> und <u>kein Vertragspartner</u>
                            für Buchungen. Der Vertrag kommt ausschließlich zwischen dem Nutzer und dem jeweiligen Anbieter
                            (z.B. Hotel, Fluggesellschaft) zustande.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 3 Nutzung der Plattform</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Die Nutzung von Voyanero.com ist kostenlos. Der Nutzer kann:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Reiseangebote suchen und vergleichen</li>
                            <li>Auf Angebote klicken und zu Buchungsplattformen weitergeleitet werden</li>
                            <li>Informationen über Reiseziele abrufen</li>
                        </ul>
                        <p className="text-slate-700 leading-relaxed mt-4">
                            Eine Registrierung ist nicht erforderlich. Die Nutzung erfolgt anonym.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 4 Affiliate-Hinweis & Provisionen</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Voyanero.com finanziert sich über Affiliate-Partnerschaften. Wenn Sie über unsere Links buchen,
                            erhalten wir eine Provision vom Anbieter. <strong>Für Sie entstehen dadurch keine zusätzlichen Kosten.</strong>
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            Die Preise sind identisch mit denen auf den Partner-Websites. Unsere Empfehlungen sind unabhängig
                            und basieren auf Qualität, Preis und Nutzerbewertungen.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 5 Haftungsausschluss</h2>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.1 Richtigkeit der Angebote</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Wir bemühen uns, stets aktuelle und korrekte Informationen bereitzustellen. Jedoch können wir keine
                            Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der angezeigten Angebote übernehmen.
                            Preise, Verfügbarkeiten und Leistungen können sich jederzeit ändern.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.2 Buchungen bei Drittanbietern</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Voyanero.com haftet nicht für:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Leistungen der vermittelten Anbieter (Hotels, Fluggesellschaften, etc.)</li>
                            <li>Stornierungsbedingungen und Rückerstattungen</li>
                            <li>Qualität der gebuchten Leistungen</li>
                            <li>Technische Probleme auf Partner-Websites</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.3 Externe Links</h3>
                        <p className="text-slate-700 leading-relaxed">
                            Unsere Plattform enthält Links zu externen Websites. Für deren Inhalte sind ausschließlich die
                            jeweiligen Betreiber verantwortlich. Wir übernehmen keine Haftung für verlinkte Inhalte.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 6 Pflichten des Nutzers</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Der Nutzer verpflichtet sich:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Die Plattform nur für rechtmäßige Zwecke zu nutzen</li>
                            <li>Keine automatisierten Systeme (Bots, Scraper) einzusetzen</li>
                            <li>Keine schädlichen Inhalte hochzuladen oder zu verbreiten</li>
                            <li>Die AGB der Partner-Plattformen bei Buchungen zu beachten</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 7 Datenschutz</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{' '}
                            <a href="/datenschutz" className="text-orange-600 hover:text-orange-700 underline">
                                Datenschutzerklärung
                            </a>. Mit der Nutzung der Plattform stimmt der Nutzer der Datenverarbeitung gemäß der
                            Datenschutzerklärung zu.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 8 Änderungen der AGB</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Wir behalten uns vor, diese AGB jederzeit zu ändern. Die aktuelle Version ist stets auf dieser
                            Seite verfügbar. Wesentliche Änderungen werden auf der Startseite angekündigt.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 9 Streitbeilegung</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                            <a
                                href="https://ec.europa.eu/consumers/odr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:text-orange-700 underline"
                            >
                                https://ec.europa.eu/consumers/odr
                            </a>
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
                            Verbraucherschlichtungsstelle teilzunehmen.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">§ 10 Schlussbestimmungen</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            <strong>Gerichtsstand:</strong> Dortmund
                        </p>
                    </section>

                    <section className="mb-8 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Kontakt</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Bei Fragen zu diesen AGB kontaktieren Sie uns unter:<br />
                            <a href="mailto:support@voyanero.com" className="text-orange-600 hover:text-orange-700 font-semibold">
                                support@voyanero.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
