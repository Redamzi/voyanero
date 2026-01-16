"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function DatenschutzPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-slate-900 mb-8">Datenschutzerklärung</h1>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Verantwortlicher</h2>
                        <p className="text-slate-700 leading-relaxed">
                            <strong>Voyanero.com</strong><br />
                            Kielstraße 28<br />
                            44145 Dortmund<br />
                            E-Mail: <a href="mailto:support@voyanero.com" className="text-orange-600 hover:text-orange-700">support@voyanero.com</a>
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Zweck der Plattform</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Voyanero.com ist ein Reise-Vergleichsportal, das Nutzern hilft, die besten Angebote für Hotels,
                            Flüge und Reisepakete zu finden. Wir vermitteln zwischen Reisenden und verschiedenen Buchungsplattformen
                            und Reiseanbietern.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Verarbeitete Daten</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Bei der Nutzung unserer Website verarbeiten wir folgende Daten:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Suchanfragen (Reiseziel, Datum, Anzahl Personen)</li>
                            <li>Technische Daten (IP-Adresse, Browser-Typ, Betriebssystem)</li>
                            <li>Nutzungsverhalten (besuchte Seiten, Klicks auf Angebote)</li>
                            <li>Cookie-Daten zur Verbesserung der Nutzererfahrung</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Rechtsgrundlage</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Die Verarbeitung erfolgt auf Grundlage von:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2 mt-4">
                            <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> - Einwilligung (z.B. Cookies)</li>
                            <li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> - Vertragserfüllung (Vermittlung)</li>
                            <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> - Berechtigtes Interesse (Analytics, Sicherheit)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Weitergabe an Dritte</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Wenn Sie auf ein Angebot klicken, werden Sie zu unseren Partner-Plattformen weitergeleitet.
                            Dabei können folgende Daten übermittelt werden:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Suchanfragen (Reiseziel, Datum, Personenanzahl)</li>
                            <li>Affiliate-Tracking-Parameter (zur Provisionszuordnung)</li>
                        </ul>
                        <p className="text-slate-700 leading-relaxed mt-4">
                            <strong>Partner-Plattformen:</strong> Booking.com, GetYourGuide, Check24, Awin-Partner
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Wir verwenden Cookies, um die Nutzererfahrung zu verbessern und Affiliate-Tracking zu ermöglichen.
                            Sie können Cookies in Ihren Browser-Einstellungen deaktivieren.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            <strong>Verwendete Cookie-Typen:</strong>
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2 mt-2">
                            <li>Technisch notwendige Cookies (Session)</li>
                            <li>Analytics-Cookies (Nutzungsstatistiken)</li>
                            <li>Affiliate-Tracking-Cookies (Provisionszuordnung)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Speicherdauer</h2>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li>Suchanfragen: Nur während der Session</li>
                            <li>Server-Logs: max. 14 Tage</li>
                            <li>Cookies: bis zu 30 Tage (Affiliate-Tracking)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Ihre Rechte (DSGVO)</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Sie haben folgende Rechte:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2">
                            <li><strong>Auskunft</strong> - Art. 15 DSGVO</li>
                            <li><strong>Berichtigung</strong> - Art. 16 DSGVO</li>
                            <li><strong>Löschung</strong> - Art. 17 DSGVO</li>
                            <li><strong>Einschränkung</strong> - Art. 18 DSGVO</li>
                            <li><strong>Datenübertragbarkeit</strong> - Art. 20 DSGVO</li>
                            <li><strong>Widerspruch</strong> - Art. 21 DSGVO</li>
                            <li><strong>Beschwerde bei Aufsichtsbehörde</strong> - Art. 77 DSGVO</li>
                        </ul>
                        <p className="text-slate-700 leading-relaxed mt-4">
                            Kontakt: <a href="mailto:support@voyanero.com" className="text-orange-600 hover:text-orange-700">support@voyanero.com</a>
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Technische Sicherheit</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten zu schützen:
                        </p>
                        <ul className="list-disc pl-6 text-slate-700 space-y-2 mt-4">
                            <li>TLS/SSL-Verschlüsselung (HTTPS)</li>
                            <li>Sichere Server-Infrastruktur (Hetzner, Deutschland)</li>
                            <li>Regelmäßige Sicherheitsupdates</li>
                            <li>Zugriffsbeschränkungen</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Änderungen</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslage oder
                            Änderungen unserer Dienste anzupassen. Die aktuelle Version finden Sie stets auf dieser Seite.
                        </p>
                        <p className="text-slate-700 leading-relaxed mt-4">
                            <strong>Stand:</strong> Januar 2026
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
