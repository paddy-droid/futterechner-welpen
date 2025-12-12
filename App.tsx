import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import VoiceAssistant from './src/components/VoiceAssistant';
import PasswordProtection from './src/components/PasswordProtection';

// --- KONSTANTEN & DATEN ---

const NUTRITION_REFERENCE = `
REFERENZWERTE FÜR KALORIENDICHTE (GEKOCHT) - ZWINGEND BEACHTEN:
- Mageres Fleisch (Huhn/Rind): ca. 165 kcal / 100g
- Reis / Nudeln / Hirse / Buchweizen: ca. 130 kcal / 100g (ACHTUNG: HOHE Energiedichte -> kleine Menge!)
- Kartoffeln: ca. 75 kcal / 100g (NIEDRIGE Energiedichte -> große Menge!)
- Süßkartoffeln: ca. 86 kcal / 100g
- Quinoa: ca. 120 kcal / 100g
- Gemüse (Karotten/Kürbis/Zucchini): ca. 30 kcal / 100g
- Öle/Fette: ca. 900 kcal / 100g

REGEL: Wenn du Reis, Hirse oder Quinoa statt Kartoffeln verwendest, muss die Menge in Gramm um ca. 40-50% reduziert werden, um die gleichen Kalorien zu erhalten!
`;

const SAFE_CARBS = `
ERLAUBTE, HOCHWERTIGE KOHLENHYDRATQUELLEN (ROTATION):
1. Kartoffeln (gekocht, geschält)
2. Reis (Parboiled oder Vollkorn, sehr weich gekocht)
3. Süßkartoffeln (gekocht)
4. Hirse (sehr gut aufgeschlossen/matschig gekocht)
5. Quinoa (gut gewaschen, weich gekocht)
6. Buchweizen (gekocht)
7. Haferflocken (als Haferschleim)
`;

// Full study text provided by the user
const STUDY_TEXT = `Fundierte Analyse der
Welpenernährung: Ein Leitfaden zur
Rationsgestaltung mit Schwerpunkt auf
selbstgekochten Rationen
I. Einleitung: Das Spannungsfeld der Modernen
Welpenernährung
Die Ernährung eines Welpen in den ersten Lebensmonaten legt das Fundament für seine
gesamte zukünftige Gesundheit. In dieser kritischen Wachstumsphase ist der Organismus
extrem vulnerabel; Ernährungsfehler, anders als beim adulten Hund, sind oft irreversibel und
können zu lebenslangen orthopädischen und metabolischen Erkrankungen führen.¹
Dieser Bericht verfolgt das Ziel, einen wissenschaftlich fundierten und praktisch umsetzbaren
Leitfaden für die selbstgekochte Welpenernährung zu bieten. Die Notwendigkeit hierfür ergibt
sich aus einem wachsenden Spannungsfeld, in dem sich moderne Hundehalter befinden:
1. Auf der einen Seite steht die etablierte Veterinärwissenschaft, prominent repräsentiert
durch Forscher wie Prof. Dr. Jürgen Zentek. Als Fachtierarzt für Tierernährung und
Autor des Standardwerks "Ernährung des Hundes" 3 legt dieser Ansatz den Fokus auf die
präzise, quantitative Bedarfsdeckung aller Nährstoffe, die Einhaltung von Minimal- und
Maximalgrenzen und die Vermeidung von Pathologien, insbesondere bei der Kalzium-
und Energieversorgung.5
2. Auf der anderen Seite steht die einflussreiche Frischfutter- und
"Longevity"-Bewegung, angeführt von Persönlichkeiten wie der Tierärztin Dr. Karen
Shaw Becker 7 und dem Tierschützer und Autor Rodney Habib. Ihre Philosophie betont
eine "artgerechte", minimal verarbeitete Nahrung 11 und stellt die gesundheitlichen
Vorteile von Frischkost gegenüber industriell verarbeitetem Futter in den Vordergrund.
3. Ergänzt wird dies durch Ansätze wie das "Clean Feeding" von Anke Jobi, das eine
Rückkehr zu einfacheren, "unverfälschten" Rationen fordert.13
Dieser Bericht wird argumentieren, dass dies kein unauflösbarer Widerspruch sein muss. Eine
sichere, artgerechte und gesunde selbstgekochte Welpenernährung (im Sinne von Becker und
Habib) ist ausschließlich dann möglich, wenn sie die strengen, wissenschaftlichen
Nährstoffanforderungen (im Sinne von Zentek, NRC und FEDIAF) präzise erfüllt. Der Fokus auf
"selbstgekocht" erhöht die Verantwortung des Besitzers exponentiell, da er nun selbst die
Bilanzierung sicherstellen muss, die sonst ein hochwertiges Alleinfuttermittel leistet.
II. Die Physiologischen Grundlagen: Der
Nährstoffbedarf des Welpen
Der Welpe ist keine Miniaturversion eines erwachsenen Hundes. Sein Stoffwechsel ist auf
schnelles Wachstum ausgelegt, was zu einem fundamental anderen Nährstoffbedarf führt.
II.1. Der Motor des Wachstums: Energie
Der Energiebedarf eines Welpen ist, relativ zu seinem Körpergewicht, exponentiell höher als
der eines adulten Hundes. Die Berechnung basiert auf dem Ruheenergiebedarf (Resting
Energy Requirement, RER), der oft als $70 \\times (Körpergewicht \\text{ in kg})^{0,75}$
kcal/Tag berechnet wird. Der tatsächliche Erhaltungsenergiebedarf (Maintenance Energy
Requirement, MER) für Welpen ist ein Vielfaches davon und passt sich dynamisch an das
Wachstum an:
• Welpen bis 4 Monate: Benötigen etwa das Dreifache ihres RER (ca. $3 \\times RER$).14
• Welpen über 4 Monate: Der Bedarf sinkt leicht auf etwa das Zweifache ihres RER (ca.
$2 \\times RER$).14
Rassespezifische Unterschiede sind hierbei kritisch. Kleine Rassen haben oft einen höheren
Energiebedarf pro Kilogramm Körpergewicht.15 Im Gegensatz dazu müssen Welpen großer
und riesiger Rassen (Large/Giant Breeds) restriktiver gefüttert werden. Ein zu hoher
Energiegehalt in der Nahrung führt bei ihnen zu einem beschleunigten Wachstum, was ein
Hauptrisikofaktor für die Entwicklung von Skeletterkrankungen ist. 16
Aufgrund der kleinen Magenkapazität muss diese hohe Energiemenge bei jungen Welpen auf
mehrere (z.B. 3-4) Mahlzeiten pro Tag verteilt werden. 18
II.2. Die Bausteine: Makronährstoffe (Protein, Fett, Kohlenhydrate)
• Protein: Essentiell für den Aufbau von Muskeln, Organen und des Immunsystems. Der
Bedarf ist im Wachstum deutlich erhöht. Die Richtlinien des National Research Council
(NRC), zitiert in wissenschaftlichen Publikationen, empfehlen:
Ο ca. $25 \\%$ Rohprotein (in der Trockensubstanz, TS) für Welpen bis 14 Wochen.
Ο ca. $20-22 \\%$ Rohprotein (TS) für Welpen über 14 Wochen.19
Wichtiger als die reine Menge ist die Proteinqualität, also die Verdaulichkeit und das
Aminosäurenprofil (z.B. Arginin, Lysin).20 Tierisches Protein ist hier pflanzlichem
überlegen, wie auch Prof. Zentek betont.6
• Fett: Dient als primärer, hochkonzentrierter Energielieferant. Noch wichtiger ist seine
Rolle als Quelle für essenzielle Fettsäuren (z.B. Omega-3 und Omega-6), die für die
Entwicklung des Gehirns, der Sehkraft und eines robusten Immunsystems unerlässlich
sind.21
• Kohlenhydrate: Obwohl Hunde keinen essenziellen Bedarf an Kohlenhydraten haben,
erfüllen sie in der Welpenernährung eine wichtige metabolische Funktion. Sie liefern
leicht verfügbare Glukose für Energie. Dies hat einen "proteinschonenden" Effekt: Wenn
genügend Energie aus Kohlenhydraten und Fetten stammt, muss der Körper nicht das
wertvolle Protein zur Energiegewinnung heranziehen.20 Studien (z.B. von Kienzle et al.)
haben gezeigt, dass komplett kohlenhydratfreie Rationen bei Zuchthündinnen zu
Problemen führen können, was die metabolische Relevanz unterstreicht.22
II.3. Die Regulatoren: NRC und FEDIAF als Goldstandard
Um sicherzustellen, dass ein Futtermittel (ob gekauft oder gekocht) den Welpen
bedarfsdeckend versorgt, existieren wissenschaftliche Gremien, die Richtlinien
veröffentlichen. Die wichtigsten sind:
• NRC (National Research Council): Das US-amerikanische Gremium, dessen Publikation
"Nutrient Requirements of Dogs and Cats" als wissenschaftliche Basis gilt. 14
• FEDIAF (European Pet Food Industry Federation): Der europäische Verband, der
praktische Richtlinien für die Futtermittelherstellung publiziert, basierend auf dem NRC
und aktueller Forschung. 20
Diese Richtlinien sind keine Kochrezepte, sondern quantitative Zielvorgaben.24 Jede
selbstgemachte Ration muss anhand dieser Zahlen auf ihre Vollständigkeit überprüft werden.
Es ist wichtig zu verstehen, dass diese Standards leicht voneinander abweichen können, da
sie auf unterschiedlichen Annahmen (z.B. zum durchschnittlichen Energiebedarf) basieren.20
Die Einhaltung eines dieser Standards (z.B. FEDIAF) ist jedoch die Grundvoraussetzung für
jede sichere Welpenernährung.
Tabelle 1: Nährstoff-Referenzwerte (FEDIAF) für Welpen (Auszug)
Diese Tabelle stellt quantitative, nicht verhandelbare Zielwerte dar, die als "Leitplanken" für
die Rationsgestaltung dienen. Die Werte beziehen sich auf die Trockensubstanz (TS) des
Futters.
Nährstoff Einheit (pro 100g TS) Welpen (Wachstum) - Minimum Welpen (Wachstum) - Maximum Anmerkung
Rohprotein % 25% (bis 14 Wo) / 20% (>14 Wo) - Basiert auf NRC-Daten.20 Qualität entscheidend.
Rohfett % 8.5% - Essenzielle Fettsäuren müssen gedeckt sein.
Kalzium (Ca) % 0.8% [25] 1.0% 1.6% (Große Rassen: 1.2%) Kritischster Wert für Welpen!
Phosphor (P) % 0.7% 1.4% Siehe Ca:P-Verhältnis.
Ca:P Verhältnis Ratio 1:1 1.8:1 (Ideal: 1.2:1 bis 1.6:1) Zentraler Risikofaktor.[5, 26]
Vitamin D IE/100g TS 11 110 Wichtig für Ca-Stoffwechsel. (Angepasst von kcal)
Jod (I) mg/100g TS 0.022 0.22 Häufiger Mangel in Hausrationen.27 (Angepasst von kcal)
Zink (Zn) mg/100g TS 2.0 - Kritisch für Haut & Immunsystem.21 (Angepasst von kcal)
(Werte sind teilweise von Energiebasis (pro 1000 kcal) auf TS-Basis umgerechnet und dienen der Orientierung; genaue Werte sind den FEDIAF-Tabellen zu entnehmen)
III. Das Hauptrisiko: Skelettentwicklung, Kalzium und die DOD-Falle
Die mit Abstand größte Gefahr bei der Aufzucht von Welpen, insbesondere großer Rassen, ist die Verursachung von Skelettentwicklungsstörungen.
III.1. Was ist DOD (Developmental Orthopedic Disease)?
DOD (Developmental Orthopedic Disease) ist ein Sammelbegriff für verschiedene Wachstumsstörungen des Skeletts, darunter:
• Hüftgelenksdysplasie (HD)
• Ellbogendysplasie (ED)
• Osteochondrose (OCD)
Obwohl eine genetische Prädisposition besteht, ist die Ernährung der Haupt-Trigger, den der Besitzer direkt kontrolliert.¹ Die Fehlerquellen sind klar definiert.
III.2. Risikofaktor 1: Energieexzess (Zu schnelles Wachstum)
Die überholte Meinung, ein "runder, dicker Welpe" sei ein gesunder Welpe, ist wissenschaftlich widerlegt. Eine zu hohe Energiezufuhr, insbesondere durch Fütterung "ad libitum" (zur freien Verfügung), ist ein Hauptrisikofaktor für DOD.17
Wegweisende Studien (z. B. Kealy RD et al., 1992, 2002, zitiert in 22) haben gezeigt, dass eine moderate Energierestriktion, die zu einem langsameren, stetigen Wachstum führt, die Inzidenz von HD signifikant senkt und die Lebensspanne verlängert.
Hier lauert eine fatale Fehleinschätzung: Ein Welpe, der durch Energieexzess zu schnell an Gewicht zunimmt, belastet sein Skelett, das noch nicht ausreichend mineralisiert ist. 28 Dies führt zu Mikroschäden und Verformungen. Der besorgte Besitzer versucht dann oft, dieses vermeintlich "schwache Skelett" durch die Zugabe von noch mehr Kalzium (z.B. "Welpenkalk") zu "stärken". Dies verschlimmert das Problem fatal.30
III.3. Risikofaktor 2: Die Kalzium-Phosphor-Imbalance
Dies ist der kritischste Punkt der Welpenernährung.
• Die fehlende Regulation: Im Gegensatz zu erwachsenen Hunden können Welpen (insbesondere bis zum 6. Lebensmonat) die Kalziumaufnahme im Darm nicht bedarfsgerecht drosseln. Sie absorbieren weitgehend passiv, was ihnen angeboten wird.¹
• Der Kalzium-Exzess: Eine Überversorgung mit Kalzium ist daher genauso schädlich wie ein Mangel. Dies geschieht oft durch gut gemeinte, aber falsch dosierte Supplemente (z.B. "Welpenkalk" zusätzlich zu einem Alleinfutter).30 Ein Kalziumüberschuss stört das empfindliche hormonelle Gleichgewicht (Calcitonin, Parathormon) und behindert den normalen Knochenumbau (die enchondrale Ossifikation), was direkt zur Entstehung von OCD beiträgt.
• Der Phosphor-Faktor: Reines Muskelfleisch, die Basis vieler Hausrationen, ist extrem phosphorreich und gleichzeitig kalziumarm.26 Eine Ration mit hohem Fleischanteil ohne korrekte Kalziumergänzung führt zu einem massiven Phosphorüberschuss (einem gestörten Ca:P-Verhältnis). Der Körper reagiert, indem er Kalzium aus den Knochen mobilisiert, um den Blutspiegel auszugleichen. Das Skelett wird instabil.
• Das Ca:P-Verhältnis: Entscheidend ist daher das Verhältnis von Kalzium zu Phosphor.
Ο Adulter Hund: ca. 1.2:1 bis 1.3:1.26
Ο Welpe: Das Verhältnis sollte idealerweise zwischen 1.2:1 und 1.6:1 liegen. 26 Ein Ungleichgewicht (z.B. unter 1:1 oder über 2:1) ist als pathologisch anzusehen. 26
IV. Schwerpunkt Selbstgekochtes: Die Praktische Umsetzung und ihre Tücken
Der Wunsch, dem Welpen eine frische, selbstgekochte Mahlzeit zu bereiten, ist nachvollziehbar. Die Umsetzung birgt jedoch erhebliche Risiken, die über die reine Ca:P-Balance hinausgehen.
IV.1. Gekocht vs. Roh (BARF): Ein wichtiger Unterschied
Die Fütterungskonzepte "gekocht" und "roh" (BARF) sind nicht austauschbar.
• BARF (Biologisch Artgerechtes Rohes Futter): Basiert typischerweise auf rohem Fleisch, Innereien und einem signifikanten Anteil an rohen, fleischigen Knochen.31 Die Knochen dienen hier als primäre Kalzium- und Phosphorquelle.
• Gekochte Ration: Knochen dürfen niemals gekocht verfüttert werden, da sie splittern und zu lebensgefährlichen Verletzungen im Magen-Darm-Trakt führen können.
Ο Konsequenz: In einer gekochten Ration fehlt die primäre Nährstoffquelle des BARF. Die Kalziumquelle muss daher extern hinzugefügt werden (z.B. Knochenmehl, Eierschale, Kalziumkarbonat, Algenkalk).26
Ο Eine gekochte Ration ist kein "gekochtes BARF". Der Entfall der Knochen reißt eine Nährstofflücke, die weit über Kalzium hinausgeht (z.B. Kupfer, Zink, Mangan). Diese Lücke wird durch simple Kalziumpräparate wie Eierschale nicht geschlossen.
IV.2. Der Feind im Topf: Nährstoffverluste durch Erhitzen
Das Kochen reduziert die Keimlast, führt aber zwangsläufig zu Nährstoffverlusten im Kochwasser und durch Hitze.
• Das Taurin-Dilemma: Taurin ist eine Aminosäure, die für die Herzfunktion, Sehkraft und das Wachstum wichtig ist.34
IV.3. Die "Nackte" Ration: Typische Mängel im Selbstgekochten
Eine simple Ration aus "Huhn, Karotte und Reis" 33, selbst wenn man Kalzium hinzufügt, ist eine garantierte Mangelernährung für einen Welpen. Typische, kritische Mängel in Hausrationen sind:
• Jod: Essentiell für die Schilddrüsenfunktion und damit für das gesamte Wachstum. Jod ist in Fleisch, Gemüse oder Ölen praktisch nicht enthalten. Es muss zwingend über Seealgenmehl 37 oder Kaliumjodid ergänzt werden.27
• Zink: Kritisch für das Immunsystem, die Haut- und Fellgesundheit.21 Der Bedarf im Wachstum ist hoch und wird durch Fleisch und Innereien oft nicht gedeckt.
• Kupfer: Wichtig für die Blutbildung und Pigmentierung. Hauptquelle sind Innereien (Leber), die jedoch exakt dosiert werden müssen, um eine Vitamin-A-Überversorgung zu vermeiden.
• Vitamin D: Essentiell für den Kalziumstoffwechsel.38 Kaum in Fleisch enthalten. Quellen sind Lebertran 37 oder fetter Fisch (z.B. Lachs).32
• Essenzielle Fettsäuren: Eine Ration aus magerem Fleisch und Reis liefert viel Omega-6, aber kaum entzündungshemmende Omega-3-Fettsäuren (EPA/DHA), die für die Gehirnentwicklung wichtig sind.21 Eine Ergänzung mit Fischöl ist notwendig.32
IV.4. Die Konsequenz: Supplementierung ist nicht optional
Selbstkochen für Welpen funktioniert nur mit einer präzisen Supplementierung.
VI. Praktische Rationsgestaltung: Der Sichere Weg zum Gekochten Welpenfutter
Basierend auf dieser Synthese lässt sich ein sicherer Fahrplan für die Erstellung einer gekochten Welpenration ableiten.
VI.1. Die Komponenten einer Gekochten Ration
Eine ausgewogene gekochte Ration 32 besteht typischerweise aus:
1. Proteinquelle (ca. 50-60%): Gekochtes Muskelfleisch (z.B. Rind, Huhn, Pute) oder Fisch.32 Fettgehalt variieren (nicht nur mager).
2. Innereien (ca. 5-10%): Gekochte Leber (wichtige Vitamin-A- und Kupfer-Quelle) 43, Herz (Taurin-Quelle).
3. Kohlenhydratquelle (ca. 15-30%): Gekochte Süßkartoffel, Kürbis, Quinoa 32 oder Reis. 33 Liefern Energie und schonen Protein.
4. Faser-/Gemüse-Quelle (ca. 10-20%): Gekocht und püriert (z.B. Karotte 33, Zucchini 33, Brokkoli 43, Spinat 32). Wichtig für die Darmgesundheit (Präbiotika 47).
5. Fettquelle (1-3%): Zur Deckung essenzieller Fettsäuren. Mischung aus Fischöl (Omega-3) 32 und einem Vitamin-E-reichen Öl (z.B. Weizenkeimöl 43).
6. Die Nährstofflücke (zwingend!): Ein Supplement, das die Defizite (Kalzium, Jod, Zink, Kupfer, Vitamine etc.) ausgleicht (siehe Abschnitt IV.4).
`;

const SUPERFOOD_INFO = `
Superfoods und Nahrungszusätze für Hunde:
- Probiotika: Naturjoghurt, Kefir, fermentiertes Gemüse (Sauerkraut).
- Präbiotika: Chicorée-Wurzel, Topinambur, FOS, GOS, Äpfel, Knoblauch (in kleinen Mengen), Spargel, Bananen, Flohsamenschalen, Blaubeeren, Kürbis, Leinsamen, Datteln, Kokosfleisch, Morosche Karottensuppe, Haferflocken.
- Andere Superfoods: Mikroalgen (Spirulina, Chlorella), Beeren (Heidelbeeren), Kurkuma, Fischöl (Omega-3).
`;

const SEASONAL_CALENDAR = {
    fruehling: `*Frühling:* Apfel, Borretsch, Brennnessel, Blattsalat, Dill, Erdäpfel, Erdbeere, Gartenkresse, Karotten, Kohlrabi, Löwenzahn, Mangold, Majoran, Minze, Petersilie, Rauner (Rote Rübe), Rhabarber, Rosmarin, Salbei, Sellerie, Spargel, Spinat, Thymian, Vogerlsalat.`,
    sommer: `*Sommer:* Aprikose, Artischocke, Apfel, Basilikum, Birne, Blattsalat, Bohnenkraut, Brokkoli, Brombeere, Dill, Endivien, Erdäpfel, Erdbeere, Fenchel, Gurke, Heidelbeere, Himbeere, Karotten, Kohlrabi, Kresse, Majoran, Mangold, Melone, Minze, Nektarine, Oregano, Rote Paprika, Pastinaken, Petersilie, Pfirsich, Rauner, Ribisel, Rosmarin, Rucola, Salat, Salbei, Sellerie, Spinat, Stachelbeere, Stangensellerie, Thymian, Zucchini, Zwetschke.`,
    herbst: `*Herbst:* Apfel, Basilikum, Birne, Blattsalat, Brokkoli, Brombeere, Chicorée, Dill, Endivie, Erdäpfel, Fenchel, Gurke, Hagebutte, Haselnuss, Karotten, Kohlrabi, Kukuruz (Mais), Kürbis, Mangold, Pastinake, Petersilie, Petersilwurzel, Preiselbeere, Radicchio, Rauner, Rosmarin, Rucola, Salbei, Schwarzwurzel, Sellerie, Spinat, Thymian, Topinambur, Vogerlsalat, Walnuss, Wirsing, Zucchini, Zwetschke.`,
    winter: `*Winter:* Apfel, Birnen, Brokkoli, Chicorée, Chinakohl, Erdäpfel, Haselnuss, Karotten, Kürbis, Pastinake, Petersilie, Petersilwurzel, Rauner (Rote Rüben), Salat, Salbei, Topinambur, Schwarzwurzel, Sellerie, Süßkartoffel, Thymian, Vogerlsalat, Walnuss, Winterspinat, Wirsing.`
};

// HELPER FUNCTIONS & COMPONENTS

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error('Failed to read file as a data URL string.'));
        }
    };
    reader.onerror = error => reject(error);
});

const InputField = ({ id, label, value, onChange, type = "text", placeholder, min = "0" }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
            placeholder={placeholder}
            min={min}
            step={type === "number" ? "0.1" : undefined}
        />
    </div>
);

const InfoCard = (props) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
        <div className="p-6">
            <div className="flex items-center">
                <div className="flex-shrink-0 text-amber-500">
                    {props.icon}
                </div>
                <div className="ml-4">
                    <h3 className="text-lg leading-6 font-bold text-gray-900">{props.title}</h3>
                </div>
            </div>
            <div className="mt-4 text-gray-700 text-sm">
                {props.children}
            </div>
        </div>
    </div>
);

const ExampleCard = ({ title, subtitle, icon, details }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center mb-4">
            <div className="text-amber-500 mr-4">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </div>
        <ul className="space-y-2 text-gray-600">
            {details.map((item, index) => (
                <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span dangerouslySetInnerHTML={{ __html: item }}></span>
                </li>
            ))}
        </ul>
    </div>
);

const SummaryItem = ({ icon, title, text }) => (
    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-amber-500 mb-4">{icon}</div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">{text}</p>
    </div>
);

const TeamMemberCard = ({ name, role, imageUrl }) => (
    <div className="text-center">
        <img className="mx-auto h-32 w-32 rounded-full object-cover object-top shadow-lg border-4 border-white" src={imageUrl} alt={name} />
        <h3 className="mt-4 text-lg font-bold text-gray-900">{name}</h3>
        <p className="mt-1 text-amber-600 font-semibold text-sm">{role}</p>
    </div>
);

const renderMarkdown = (text) => {
    if (!text) return null;

    const parseInline = (line) => {
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} className="space-y-2 my-4 list-disc list-inside text-gray-700">{listItems}</ul>);
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
            flushList();
            elements.push(<h3 key={index} className="text-xl font-bold mt-6 mb-3 text-amber-600">{line.slice(2, -2)}</h3>);

        } else if (line.startsWith('* ')) {
            listItems.push(<li key={index}>{parseInline(line.slice(2))}</li>);

        } else if (line.trim() === '') {
            flushList();

        } else {
            flushList();
            elements.push(<p key={index} className="mb-2 text-gray-700">{parseInline(line)}</p>);
        }
    });

    flushList();

    return elements;
};

const renderAnalysis = (text) => {
    if (!text) return null;

    const icons = {
        "Gesamtbewertung & Fazit": <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        "Positive Aspekte": <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-1.9 3.8a2 2 0 00.23 2.16l3.955 3.955A2 2 0 0014 10z" /></svg>,
        "Zu Bedenken": <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        "Potenzielle Allergene": <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        "Nachhaltigkeits-Check": <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9a9 9 0 019-9" /></svg>,
    };

    const parseInline = (line) => {
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} className="space-y-2 my-4 list-disc list-inside text-gray-700">{listItems}</ul>);
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
            flushList();
            const title = line.slice(2, -2).trim();
            const icon = icons[title];
            elements.push(
                <div key={index} className="flex items-center mt-8 mb-4">
                    {icon && <span className="text-amber-500 mr-4 flex-shrink-0">{icon}</span>}
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                </div>
            );
        } else if (line.startsWith('* ')) {
            listItems.push(<li key={index} className="leading-relaxed">{parseInline(line.slice(2))}</li>);
        } else if (line.trim() === '') {
            flushList();
        } else {
            flushList();
            elements.push(<p key={index} className="mb-3 text-gray-700 leading-relaxed">{parseInline(line)}</p>);
        }
    });

    flushList();
    return elements;
};


const AiLoader = ({ text }) => (
    <div className="mt-10 p-8 rounded-2xl text-center">
        <div className="flex justify-center items-center">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-amber-600 font-semibold">{text}</p>
        </div>
    </div>
);

const RecipeCard: React.FC<{ recipe: any; day: string }> = ({ recipe, day }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <div className="bg-amber-500 p-4 text-white">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">{day}</span>
                <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                    <span className="text-xs font-medium">~{recipe.calories} kcal</span>
                </div>
            </div>
            <h3 className="text-xl font-bold mt-2 leading-tight">{recipe.title}</h3>
        </div>

        <div className="p-5 flex-grow flex flex-col">
            <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Zutaten</h4>
                <ul className="space-y-2">
                    {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 mr-2 flex-shrink-0"></span>
                            <span><span className="font-bold">{ing.amount}</span> {ing.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Zubereitung</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{recipe.instructions}</p>
            </div>

            {recipe.superfood_info && (
                <div className="mb-4 bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                        Superfood-Highlight
                    </h4>
                    <p className="text-xs text-green-800 leading-relaxed">{recipe.superfood_info}</p>
                </div>
            )}

            {recipe.supplementation_info && (
                <div className="mt-auto pt-4 border-t border-gray-100 bg-amber-50 -mx-5 px-5 pb-2">
                    <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 mt-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        Wichtig: Supplementierung
                    </h4>
                    <div className="text-xs text-amber-800 leading-relaxed prose prose-sm prose-amber">
                        {renderMarkdown(recipe.supplementation_info)}
                    </div>
                </div>
            )}
        </div>
    </div>
);

const WeeklyPlanGrid = ({ recipes }: { recipes: any[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} day={`Tag ${index + 1}`} />
        ))}
    </div>
);

const App = () => {
    const [view, setView] = useState('selection');

    const BackButton = ({ onBack }) => (
        <div className="mb-8">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
            >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Zurück zur Auswahl
            </button>
        </div>
    );

    const SelectionView = () => (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Wie fütterst Du?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Wähle eine Option, um ein wissenschaftlich fundiertes Feedback zu erhalten.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div onClick={() => setView('calculator')} className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-transparent hover:border-amber-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2">
                    <div className="text-amber-500 mx-auto mb-4 h-16 w-16 flex items-center justify-center bg-amber-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Selbstkochen für Welpen</h3>
                    <p className="text-sm text-gray-600">Berechne den individuellen Bedarf und erhalte einen kompletten Futterplan.</p>
                </div>
                <div onClick={() => setView('analyzer')} className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-transparent hover:border-amber-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2">
                    <div className="text-amber-500 mx-auto mb-4 h-16 w-16 flex items-center justify-center bg-amber-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Futter-Analyse</h3>
                    <p className="text-sm text-gray-600">Lass das Futter Deines Hundes analysieren – per Name oder Foto.</p>
                </div>
                <div onClick={() => setView('kackiAnalyzer')} className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-transparent hover:border-amber-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2">
                    <div className="text-amber-500 mx-auto mb-4 h-16 w-16 flex items-center justify-center bg-amber-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Kacki Analyser</h3>
                    <p className="text-sm text-gray-600">Deep-Vision Analyse für Kot: Gesundheit, Verdauung & Warnsignale.</p>
                </div>
            </div>
        </div>
    );

    const CalculatorView = () => {
        const [weight, setWeight] = useState('');
        const [age, setAge] = useState('');
        const [breedSize, setBreedSize] = useState('medium');
        const [activityLevel, setActivityLevel] = useState('normal');
        const [calories, setCalories] = useState(null);
        const [error, setError] = useState('');
        const [recipeConcepts, setRecipeConcepts] = useState(null);
        const [detailedRecipes, setDetailedRecipes] = useState(null);
        const [loadingStep, setLoadingStep] = useState(null); // 'concept' | 'detail' | null
        const [aiResponse, setAiResponse] = useState(''); // Keep for single day plan text fallback if needed, or remove if fully replacing. Let's keep for Day 1 preview.
        const [isLoadingAi, setIsLoadingAi] = useState(false);
        const [selectedSeason, setSelectedSeason] = useState('');

        const handleCalculate = useCallback(async () => {
            setError('');
            setCalories(null);
            setAiResponse('');
            setRecipeConcepts(null);
            setDetailedRecipes(null);
            setSelectedSeason('');

            const weightKg = parseFloat(weight);
            const ageWeeks = parseInt(age, 10);

            if (isNaN(weightKg) || isNaN(ageWeeks) || weightKg <= 0 || ageWeeks <= 0) {
                setError('Bitte geben Sie gültige Werte für Gewicht und Alter ein.');
                return;
            }

            const rer = 70 * Math.pow(weightKg, 0.75);
            let merFactor;
            if (ageWeeks <= 16) merFactor = 3;
            else if (ageWeeks <= 26) merFactor = 2;
            else merFactor = 1.6;

            const activityMultipliers = { ruhig: 0.9, normal: 1.0, aktiv: 1.1 };
            merFactor *= activityMultipliers[activityLevel];

            const calculatedCalories = rer * merFactor;
            setCalories(calculatedCalories);
            setIsLoadingAi(true);

            try {
                const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

                // --- STEP 1: Single Day Preview (JSON) ---
                const prompt = `
Du bist ein Experte für Hundeernährung. Erstelle einen präzisen Tagesfutterplan für eine **selbstgekochte Ration**.

DATEN DES WELPEN:
- Alter: ${ageWeeks} Wochen
- Gewicht: ${weightKg} kg
- Rassegröße: ${breedSize}
- Aktivitätslevel: ${activityLevel}
- **Täglicher Kalorienbedarf (Ziel): ${calculatedCalories.toFixed(0)} kcal**

${NUTRITION_REFERENCE}

AUFGABE:
Berechne ein perfektes Beispiel-Rezept, das exakt den Kalorienbedarf deckt.
Gib das Ergebnis als valides JSON zurück.

WICHTIG: BAUKASTEN-SYSTEM (STRIKT NACH STUDIE):
Die Ration MUSS exakt wie folgt aufgebaut sein (Gramm-Basis):
- **50-60% Proteinquelle** (Muskelfleisch/Fisch - GEKOCHT oder GEBRATEN)
- **5-10% Innereien** (WICHTIG: Variiere! Nicht nur Leber, sondern auch Hühnermägen, Lunge, Herz, Niere etc. Leber darf nicht die einzige Innerei sein! Alles GEKOCHT.)
- **15-30% Kohlenhydratquelle** (Kartoffeln/Reis/Hirse - GEKOCHT)
- **10-20% Faser-/Gemüse-Quelle** (GEKOCHT/PÜRIERT)
- **1-3% Fettquelle** (Öle)

WICHTIG: ZWINGENDE SUPPLEMENTE (MÜSSEN IN DIE ZUTATENLISTE):
1. **CALCIUM:** Füge IMMER "Eierschalenpulver" (oder Algenkalk) als Zutat hinzu. Menge: ca. 0,5 - 0,6g pro 100g Fleisch.
2. **JOD:** Füge IMMER "Seealgenmehl" als Zutat hinzu.
3. **Öl-Rotation:** Verwende NICHT nur Lachsöl. Wechsle ab mit Weizenkeimöl, Leinöl, Hanföl, etc.

WICHTIG ZUR SUPPLEMENTIERUNG & ÖLEN:
- **Mengenangaben:** Gib bei der Supplementierung SCHÄTZWERTE in Gramm an (z.B. "ca. X g Eierschalenpulver", "ca. Y g Seealgenmehl").
- **Superfoods:** Wähle ein passendes Superfood aus der Liste und erkläre im Feld "superfood_info" kurz, warum es so gesund ist (z.B. "Kürbis ist gut für die Verdauung...").

JSON-Format:
{
  "title": "Kreativer Name des Gerichts",
  "calories": ${calculatedCalories.toFixed(0)},
  "ingredients": [
    { "name": "Zutat Name", "amount": "Menge in Gramm (z.B. '200g (~150 kcal)')" }
  ],
  "instructions": "Kurze Zubereitungsanweisung (Fließtext)",
  "nutritional_focus": "Kurzer Satz, warum das gut ist",
  "superfood_info": "Name des Superfoods: Erklärung warum es toll ist.",
  "supplementation_info": "Warnung + Konkrete Mengenschätzung für Eierschalenpulver/Seealgenmehl + Öl-Empfehlung."
}

STUDIE ZUR ORIENTIERUNG:
${STUDY_TEXT}`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: "application/json" }
                });

                const dayPlan = JSON.parse(response.text);
                setAiResponse(dayPlan); // Now storing object, not string

            } catch (e) {
                console.error(e);
                setError('Bei der Erstellung des Futterplans durch die KI ist ein Fehler aufgetreten.');
                setAiResponse(null);
            } finally {
                setIsLoadingAi(false);
            }

        }, [weight, age, breedSize, activityLevel]);

        const handleGenerateWeeklyPlan = useCallback(async (season) => {
            if (!season) {
                setError('Bitte wählen Sie eine Jahreszeit aus.');
                return;
            }
            setError('');
            setLoadingStep('concept');
            setRecipeConcepts(null);
            setDetailedRecipes(null);

            try {
                const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

                // --- PHASE 1: CONCEPT GENERATION ---
                const conceptPrompt = `
Erstelle einen abwechslungsreichen 7-Tage-Futterplan (Konzept) für einen Welpen.

BASIS-WERTE:
- Kalorienziel pro Tag: ${calories.toFixed(0)} kcal
- Jahreszeit: ${season}
- Saisonale Zutaten: ${SEASONAL_CALENDAR[season]}
- Erlaubte Kohlenhydrate (Rotation): ${SAFE_CARBS}

AUFGABE:
Erstelle 7 unterschiedliche Rezept-Konzepte. Rotiere die Kohlenhydratquellen (Reis, Kartoffel, Hirse, etc.) und Proteinquellen.
WICHTIG: Plane NUR gekochte oder gebratene Komponenten. Kein rohes Fleisch oder Gemüse.
Plane auch die Innereien-Quelle für jeden Tag, um Abwechslung zu garantieren (z.B. Hühnermägen, Rinderlunge, Putenherz, Leber - aber nicht jeden Tag Leber!).
Gib NUR das JSON-Gerüst zurück.

JSON-Format:
[
  {
    "day": 1,
    "title": "Kreativer Name",
    "main_protein": "z.B. Rindfleisch",
    "offal_source": "z.B. Hühnerherzen",
    "carb_source": "z.B. Kartoffeln",
    "veggies": "z.B. Karotten, Zucchini"
  },
  ... (für 7 Tage)
]
`;
                const conceptResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: conceptPrompt,
                    config: { responseMimeType: "application/json" }
                });

                const concepts = JSON.parse(conceptResponse.text.replace(/```json/g, '').replace(/```/g, '').trim());
                setRecipeConcepts(concepts);
                setLoadingStep('detail');

                // --- PHASE 2: DETAIL GENERATION (IN BATCHES) ---
                // We split the 7 days into chunks to ensure high quality output for each recipe.
                const chunks = [
                    concepts.slice(0, 2), // Days 1-2
                    concepts.slice(2, 4), // Days 3-4
                    concepts.slice(4, 7)  // Days 5-7
                ];

                let allDetailedRecipes = [];

                for (const chunk of chunks) {
                    const detailPrompt = `
Du bist ein präziser Ernährungs-Rechner für Hunde. Erstelle detaillierte Rezepte für die folgenden Konzepte.

KONZEPTE (Teil der Woche):
${JSON.stringify(chunk)}

STRIKTE VORGABEN (MATHEMATISCH):
1.  **Ziel-Kalorien:** EXAKT ${calories.toFixed(0)} kcal pro Rezept.
2.  **ZWINGENDE SUPPLEMENTE (MÜSSEN IN DIE ZUTATENLISTE):**
    - **CALCIUM:** JEDES Rezept MUSS "Eierschalenpulver" (oder Algenkalk) enthalten. Menge: ca. 0,5 - 0,6g pro 100g Fleisch.
    - **JOD:** JEDES Rezept MUSS "Seealgenmehl" enthalten.
    - **ÖL:** Nutze hochwertige Öle (Lachsöl, Leinöl, Hanföl).
3.  **MENGEN-VERHÄLTNIS (Das "Baukasten-System" - KORRIGIERT):**
    Die Gesamtfuttermenge muss sich zwingend an diese Verteilung halten (Gramm-Basis).
    **ACHTUNG: Der Fleischanteil war zuletzt zu hoch. Halte dich strikt an diese Obergrenzen:**
    
    - **45-50%** Muskelfleisch (GEKOCHT oder GEBRATEN - Nicht mehr!)
    - **5-10%** Innereien (WICHTIG: Nutze die geplante Innerei. Variiere! Nicht nur Leber, sondern auch Herz, Mägen, Lunge. Leber sollte nicht dominieren. Alles GEKOCHT.)
    - **25-30%** Kohlenhydrate (gekocht) - *Erhöhe diesen Anteil leicht, um Fleisch zu reduzieren.*
    - **15-20%** Gemüse/Obst (GEKOCHT/PÜRIERT)
    - **1-3%** Öl

    *Beispiel-Rechnung:* Bei 500g Gesamtfutter -> Fleisch MAXIMAL 250g, Innereien ca. 30-50g. Der Rest MUSS Beilage sein.

4.  **Superfoods:** Füge das Superfood aus dem Konzept hinzu.

JSON-Format (Array von Objekten):
[
  {
    "day": X,
    "title": "Name",
    "calories": ${calories.toFixed(0)},
    "ingredients": [
      { "name": "Zutat", "amount": "Gramm (~kcal)" }
    ],
    "instructions": "Zubereitung...",
    "nutritional_focus": "Fokus...",
    "superfood_info": "Superfood Erklärung...",
    "supplementation_info": "Supplementierung..."
  }
]
`;
                    // Add a small delay to avoid rate limits if necessary, though sequential await is usually fine.
                    const chunkResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: detailPrompt,
                        config: { responseMimeType: "application/json" }
                    });

                    const chunkRecipes = JSON.parse(chunkResponse.text.replace(/```json/g, '').replace(/```/g, '').trim());
                    allDetailedRecipes = [...allDetailedRecipes, ...chunkRecipes];
                }

                setDetailedRecipes(allDetailedRecipes);

            } catch (e) {
                console.error(e);
                setError('Bei der Erstellung des Wochenplans ist ein Fehler aufgetreten.');
            } finally {
                setLoadingStep(null);
            }
        }, [calories]);


        return (
            <>
                <BackButton onBack={() => setView('selection')} />
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Das Team hinter Willenskraft</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <TeamMemberCard
                            name="Bianca Oriana Willen"
                            role="Gründerin, Trainerin & zert. Hundeernährungsberaterin"
                            imageUrl="https://www.willenskraft.co.at/wp-content/uploads/2016/05/Bianca-und-Hunde.jpg"
                        />
                        <TeamMemberCard
                            name="Ing. Jessica Pusch"
                            role="Leitung Hundeschule Wien, NÖ & Nordburgenland"
                            imageUrl="https://www.willenskraft.co.at/wp-content/uploads/2025/06/Jessica-Pusch-Hundeschule-Wien-Niederoesterreich.webp"
                        />
                        <TeamMemberCard
                            name="Martha Höhr"
                            role="Leitung Hundeschule Graz"
                            imageUrl="https://www.willenskraft.co.at/wp-content/uploads/2020/01/DSC07056.jpg"
                        />
                        <TeamMemberCard
                            name="Dr. Nicole Nemeth"
                            role="Tierärztin"
                            imageUrl="https://www.willenskraft.co.at/wp-content/uploads/2020/03/Nicole-Nemeth-845x684.jpg"
                        />
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Beispiele für bedarfsgerechte Rationen</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ExampleCard
                            title="Kleiner Energiebündel"
                            subtitle="12 Wochen, 4kg, aktiv"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>}
                            details={["<strong>~653 kcal / Tag</strong>", "Fokus auf <strong>Protein & Fett:</strong> Dies sind die primären Bausteine für schnelles Wachstum und die Entwicklung des Gehirns.", "Angepasste Mineralien für einen kleinen Körper."]}
                        />
                        <ExampleCard
                            title="Großer, gelassener Welpe"
                            subtitle="20 Wochen, 15kg, ruhig"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>}
                            details={["<strong>~960 kcal / Tag</strong>", "<strong>Kontrollierte Energie</strong> gegen zu schnelles Wachstum.", "<strong>Essentielle Ca:P-Balance:</strong> Das Kalzium-Phosphor-Verhältnis (ideal 1.2:1) ist entscheidend, um Skelettprobleme zu vermeiden."]}
                        />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Berechne den individuellen Bedarf Deines Welpen</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <InputField id="weight" label="Gewicht (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="z.B. 5.5" />
                        <InputField id="age" label="Alter (Wochen)" value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="z.B. 12" />
                        <div>
                            <label htmlFor="breedSize" className="block text-sm font-medium text-gray-600 mb-2">Erwartete Rassegröße</label>
                            <select id="breedSize" value={breedSize} onChange={(e) => setBreedSize(e.target.value)} className="mt-1 block w-full pl-4 pr-10 py-3 text-base bg-gray-100 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition">
                                <option value="small">Klein (bis 10kg)</option>
                                <option value="medium">Mittel (11-25kg)</option>
                                <option value="large">Groß (ab 26kg)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-600 mb-2">Aktivitätslevel</label>
                            <select id="activityLevel" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="mt-1 block w-full pl-4 pr-10 py-3 text-base bg-gray-100 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition">
                                <option value="ruhig">Ruhig</option>
                                <option value="normal">Normal</option>
                                <option value="aktiv">Aktiv</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button onClick={handleCalculate} disabled={isLoadingAi || !weight || !age} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
                            {isLoadingAi ? 'Berechne...' : 'Bedarf & Futterplan berechnen'}
                        </button>
                    </div>
                    {error && <p className="text-red-600 text-center text-sm mt-4">{error}</p>}
                </div>

                {calories !== null && (
                    <div className="mt-10 bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Geschätzter Tagesbedarf</h2>
                        <p className="text-6xl font-extrabold my-4 text-amber-500">{calories.toFixed(0)}</p>
                        <p className="text-gray-600">kcal / Tag</p>
                    </div>
                )}

                {isLoadingAi && <AiLoader text="KI-Mahlzeitplan wird erstellt..." />}

                {aiResponse && (
                    <div className="mt-10 bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                        <div className="flex items-center mb-6">
                            <span className="text-amber-500 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">Dein Beispiel-Tagesplan</h2>
                        </div>

                        {/* Render Single Day Recipe Card */}
                        <div className="max-w-md mx-auto">
                            <RecipeCard recipe={aiResponse} day="Beispiel-Tag" />
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                <span className="font-bold">Wichtiger Hinweis:</span> Dieser Futterplan ist eine auf Basis der Studie generierte, beispielhafte Empfehlung und ersetzt keine professionelle tierärztliche Beratung. Jeder Welpe ist individuell.
                            </p>
                        </div>
                    </div>
                )}

                {aiResponse && !detailedRecipes && (
                    <div className="mt-10 bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Nächster Schritt: 7-Tage-Plan erstellen</h2>
                        <p className="text-center text-gray-600 mb-6">Wähle die aktuelle Jahreszeit, um einen detaillierten 7-Tage-Rezeptplan mit saisonalen Zutaten zu erhalten.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <select
                                value={selectedSeason}
                                onChange={(e) => setSelectedSeason(e.target.value)}
                                className="w-full sm:w-auto block pl-4 pr-10 py-3 text-base bg-gray-100 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
                            >
                                <option value="" disabled>Jahreszeit wählen...</option>
                                <option value="fruehling">Frühling</option>
                                <option value="sommer">Sommer</option>
                                <option value="herbst">Herbst</option>
                                <option value="winter">Winter</option>
                            </select>
                            <button
                                onClick={() => handleGenerateWeeklyPlan(selectedSeason)}
                                disabled={!!loadingStep || !selectedSeason}
                                className="w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {loadingStep ? 'Erstelle...' : 'Wochenplan erstellen'}
                            </button>
                        </div>
                    </div>
                )}

                {loadingStep === 'concept' && <AiLoader text="Phase 1: Entwerfe abwechslungsreiche Rezept-Konzepte..." />}
                {loadingStep === 'detail' && <AiLoader text="Phase 2: Berechne exakte Grammmengen & Details..." />}

                {detailedRecipes && (
                    <div className="mt-10 bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                        <div className="flex items-center mb-6">
                            <span className="text-amber-500 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">Dein saisonaler 7-Tage-Rezeptplan</h2>
                        </div>

                        <WeeklyPlanGrid recipes={detailedRecipes} />

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                <span className="font-bold">Wichtiger Hinweis:</span> Dieser Futterplan ist eine auf Basis der Studie generierte, beispielhafte Empfehlung und ersetzt keine professionelle tierärztliche Beratung. Jeder Welpe ist individuell.
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-16">
                    <InfoCard title="Wissenschaftliche Wachstumsfaktoren" icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                        <ul className="space-y-2 list-disc list-inside">
                            <li><span className="font-semibold">Bis 4 Monate (≤ 16 Wochen):</span> Benötigen ca. das <strong>3-fache</strong> ihres Ruheenergiebedarfs (RER).</li>
                            <li><span className="font-semibold">5 - 6 Monate (≤ 26 Wochen):</span> Der Bedarf sinkt auf ca. das <strong>2-fache</strong> des RER.</li>
                            <li><span className="font-semibold">7 - 12 Monate (≤ 52 Wochen):</span> Der Bedarf sinkt weiter auf ca. das <strong>1.6-fache</strong> des RER.</li>
                            <li><span className="font-semibold">Große Rassen:</span> Benötigen eine restriktivere Fütterung, um ein zu schnelles Wachstum und Skelettprobleme (DOD) zu vermeiden.</li>
                        </ul>
                    </InfoCard>
                </div>

                <div className="mt-16 mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Woher kommen die Zahlen?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Kurz zusammengefasst: Die Berechnung basiert auf wissenschaftlichen Standards, um eine sichere und bedarfsgerechte Ernährung zu gewährleisten.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <SummaryItem
                            title="Basis: Der Ruhebedarf (RER)"
                            text="Die Basis ist der Ruheenergiebedarf (RER) nach der Formel 70 x (Körpergewicht)^0,75. Diese berechnet die Energie, die ein Welpe im Ruhezustand nur für seine Lebensfunktionen verbraucht."
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                        />
                        <SummaryItem
                            title="Anpassung: Das Wachstum"
                            text="Da Welpen rasant wachsen, wird der RER mit einem Faktor multipliziert: x3 (bis 4 Mon.), x2 (5-6 Mon.) und x1.6 (7-12 Mon.), um den Energiebedarf zu decken."
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                        />
                        <SummaryItem
                            title="Ganzheitlich: Die Nährstoffe"
                            text="Die Futterpläne betonen, wie wichtig eine komplette Nährstoffversorgung (insb. Kalzium & Jod) bei selbstgekochten Rationen laut Studie ist."
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                    </div>
                </div>
            </>
        )
    };

    const AnalyzerView = () => {
        const [foodName, setFoodName] = useState('');
        const [foodImage, setFoodImage] = useState(null);
        const [imagePreview, setImagePreview] = useState(null);
        const [compositionText, setCompositionText] = useState('');
        const [analysis, setAnalysis] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');
        const fileInputRef = useRef(null);
        const cameraInputRef = useRef(null);

        const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setFoodImage(file);
                setImagePreview(URL.createObjectURL(file));
                setError('');
            }
        };

        const handleAnalyze = async () => {
            if (!foodName && !foodImage && !compositionText) {
                setError('Bitte geben Sie einen Namen ein, fügen Sie die Zusammensetzung ein oder laden Sie ein Bild hoch.');
                return;
            }
            setError('');
            setIsLoading(true);
            setAnalysis('');

            try {
                const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
                let contents;
                let config = {};

                const basePrompt = `Basierend auf der folgenden wissenschaftlichen Studie über Hundeernährung, analysiere das Hundefutter.

**Analyse-Anweisungen:**
1.  **Gib ehrliches, wissenschaftlich fundiertes Feedback**. Konzentriere dich auf:
    * **Proteinquellen:** Sind sie tierisch, klar deklariert (z.B. "Hühnerfleisch" statt "tierische Nebenerzeugnisse") und von hoher Qualität? (Siehe Studie II.2)
    * **Energiequellen:** Stammt die Energie hauptsächlich aus Fett und hochwertigen Kohlenhydraten oder aus billigen Füllstoffen wie Weizen oder Mais in großen Mengen? (Siehe Studie II.2)
    * **Kalzium-Phosphor-Verhältnis (falls angegeben):** Liegt es im idealen Bereich (ca. 1.2:1 - 1.6:1)? (Siehe Studie III.3)
    * **Zusätze:** Enthält es nützliche Zusätze wie Omega-3-Fettsäuren oder unnötige künstliche Konservierungs-, Farb- oder Aromastoffe?
2.  **Identifiziere potenzielle Allergene:** Liste gängige Allergene auf, die im Futter enthalten sind (z.B. Weizen, Soja, Rind, Huhn).
3.  **Führe einen Nachhaltigkeits-Check durch (Kontext: Österreich):**
    * Bewerte kurz den **CO2-Fußabdruck** basierend auf den Hauptproteinquellen (z.B. Rind hat einen höheren Abdruck als Huhn).
    * Schätze die **Regionalität** ein. Könnten die Zutaten potenziell aus Österreich/EU stammen?
    * Gib eine kurze Einschätzung zur **Verpackung** (z.B. ist es wahrscheinlich eine recyclebare Dose oder ein Plastiksack?).

**Struktur und Formatierung (Strikt einzuhalten):**
Deine Antwort MUSS exakt die folgende Struktur und die vorgegebenen Markdown-Überschriften verwenden. Fasse dich kurz und prägnant.

**Gesamtbewertung & Fazit**
* Beginne mit einer kurzen, klaren Bewertung in einem Satz (z.B., "Ein hochwertiges Futter, das für die meisten Hunde gut geeignet ist."). Gib anschließend ein kurzes Fazit.

**Positive Aspekte**
* Liste hier stichpunktartig die positiven Eigenschaften des Futters auf.

**Zu Bedenken**
* Liste hier stichpunktartig die negativen oder zu bedenkenden Aspekte auf.

**Potenzielle Allergene**
* Liste hier stichpunktartig die enthaltenen, gängigen Allergene auf.

**Nachhaltigkeits-Check**
* Bewerte hier kurz den CO2-Fußabdruck, die Regionalität und die Verpackung, wie in den Anweisungen beschrieben.

**STUDIE (Wissensbasis):**
---
${STUDY_TEXT}
---
**Zusatzinfo Superfoods (Positiv hervorzuheben):**
---
${SUPERFOOD_INFO}
---
`;

                // Prioritization: Image > Text > Name
                if (foodImage) {
                    const base64Image = await fileToBase64(foodImage);
                    const imagePrompt = `${basePrompt}\n**Analyse-Aufgabe:** Analysiere das Futter basierend auf dem folgenden Bild der Inhaltsstoffe. Lies die Zutatenliste und die Nährwertanalyse sorgfältig aus.`
                    contents = { parts: [{ text: imagePrompt }, { inlineData: { mimeType: foodImage.type, data: base64Image } }] };
                } else if (compositionText) {
                    const textPrompt = `${basePrompt}\n**Analyse-Aufgabe:** Analysiere das Futter basierend auf der folgenden, vom Nutzer eingefügten Zusammensetzung:\n\n---\n${compositionText}\n---`
                    contents = textPrompt;
                } else if (foodName) {
                    const searchPrompt = `Basierend auf der folgenden wissenschaftlichen Studie über Hundeernährung, führe folgende Schritte aus:
1.  **Suche online** nach der genauen Zusammensetzung und den Nährwertangaben für das Hundefutter namens "${foodName}". Nutze ausschließlich vertrauenswürdige Quellen wie die Herstellerseite oder seriöse Händler.
2.  **Prüfe die Eindeutigkeit:** Wenn du mehrere widersprüchliche Zusammensetzungen findest oder keine vertrauenswürdige Quelle, gib **ausschließlich** den Text "DATEN_UNZUVERLAESSIG" zurück und sonst nichts.
3.  **Wenn du eindeutige Daten findest**, analysiere das Futter basierend auf diesen Daten und der bereitgestellten Studie. Folge dabei den unten stehenden Analyse-Anweisungen.

${basePrompt}
`;
                    contents = searchPrompt;
                    config = { tools: [{ googleSearch: {} }] };
                }

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents,
                    config,
                });

                if (foodName && !foodImage && !compositionText && response.text.trim() === 'DATEN_UNZUVERLAESSIG') {
                    setError('Keine eindeutigen oder vertrauenswürdigen Daten für dieses Futter gefunden. Bitte lade ein Foto hoch oder füge die Zusammensetzung manuell ein, um eine genaue Analyse zu erhalten.');
                    setAnalysis('');
                } else {
                    setAnalysis(response.text);
                }

            } catch (e) {
                console.error(e);
                setError('Die Analyse konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.');
            } finally {
                setIsLoading(false);
            }
        };


        return (
            <>
                <BackButton onBack={() => setView('selection')} />
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Futter-Analyse</h2>
                    <p className="text-center text-gray-600 mb-8">Erhalt eine wissenschaftlich fundierte Analyse deines Hundefutters. Die genaueste Analyse erfolgt per Foto oder eingefügtem Text.</p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Option 1: Foto der Zusammensetzung (Empfohlen)</label>
                            <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 min-h-[160px]">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Vorschau" className="max-h-40 object-contain rounded-lg" />
                                ) : (
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="text-sm text-gray-600">Vorschau des Bildes</p>
                                        <p className="text-xs text-gray-500">Bitte Foto aufnehmen oder hochladen</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => cameraInputRef.current?.click()}
                                    className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Kamera nutzen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Foto hochladen
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <input
                                ref={cameraInputRef}
                                id="camera-upload"
                                name="camera-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300"></div></div>
                            <div className="relative flex justify-center"><span className="bg-white px-2 text-sm text-gray-500">ODER</span></div>
                        </div>

                        <div>
                            <label htmlFor="compositionText" className="block text-sm font-medium text-gray-600 mb-2">Option 2: Zusammensetzung manuell einfügen</label>
                            <textarea
                                id="compositionText"
                                rows={5}
                                className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
                                placeholder="Füge hier die Inhaltsstoffe von der Verpackung ein..."
                                value={compositionText}
                                onChange={(e) => setCompositionText(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300"></div></div>
                            <div className="relative flex justify-center"><span className="bg-white px-2 text-sm text-gray-500">ODER</span></div>
                        </div>

                        <InputField
                            id="foodName"
                            label="Option 3: Name des Futters (für Web-Recherche)"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            placeholder="z.B. 'Marke X Welpenfutter'"
                        />
                    </div>


                    <div className="mt-8">
                        <button onClick={handleAnalyze} disabled={isLoading || (!foodName && !foodImage && !compositionText)} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
                            {isLoading ? 'Analysiere...' : 'Futter analysieren'}
                        </button>
                    </div>
                    {error && <p className="text-red-600 text-center text-sm mt-4">{error}</p>}
                </div>

                {isLoading && <AiLoader text="Futter wird analysiert..." />}

                {analysis && (
                    <div className="mt-10 bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                        <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                            <span className="text-amber-500 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">Ergebnis der Futter-Analyse</h2>
                        </div>
                        <div className="max-w-none">
                            {renderAnalysis(analysis)}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                <span className="font-bold">Wichtiger Hinweis:</span> Diese Analyse ist eine auf Basis der Studie generierte, KI-basierte Einschätzung und ersetzt keine professionelle tierärztliche Ernährungsberatung.
                            </p>
                        </div>
                    </div>
                )}
            </>
        )
    };

    const KackiAnalyzerView = () => {
        const [poopImage, setPoopImage] = useState(null);
        const [imagePreview, setImagePreview] = useState(null);
        const [analysisResult, setAnalysisResult] = useState(null);
        const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [loadingText, setLoadingText] = useState('Starte Analyse...');
        const [error, setError] = useState('');
        const fileInputRef = useRef(null);
        const cameraInputRef = useRef(null);

        const loadingTexts = [
            "Analysiere Textur...",
            "Prüfe auf Auffälligkeiten...",
            "Vergleiche mit Bristol-Skala...",
            "Untersuche Farbgebung...",
            "Generiere tierärztliche Einschätzung..."
        ];

        useEffect(() => {
            let interval;
            if (isLoading) {
                let i = 0;
                interval = setInterval(() => {
                    setLoadingText(loadingTexts[i % loadingTexts.length]);
                    i++;
                }, 800);
            }
            return () => clearInterval(interval);
        }, [isLoading]);

        const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setPoopImage(file);
                setImagePreview(URL.createObjectURL(file));
                setError('');
                setAnalysisResult(null);
            }
        };

        const handleAnalyze = async () => {
            if (!poopImage) {
                setError('Bitte lade ein Bild hoch.');
                return;
            }
            setError('');
            setIsLoading(true);
            setAnalysisResult(null);

            try {
                const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
                const base64Image = await fileToBase64(poopImage);

                const systemPrompt = `
Du bist Dr. Vet (Willenskraft AI), spezialisiert auf gastroenterologische Gesundheit bei Hunden.
Deine Aufgabe: Eine tiefgehende visuelle Analyse des hochgeladenen Kot-Bildes.

ANALYSE-TIEFE (Vision):
Schau genau hin. Bewerte nicht nur die Form (Bristol Scale), sondern auch:
- Farbe (z.B. Gelblich = evtl. zu schnelle Passage/Unverträglichkeit; Schwarz = Sofort Tierarzt; Blutig = Sofort Tierarzt).
- Textur & Oberfläche (Schleimig? Trocken/Bröselig? Fettig glänzend?).
- Fremdkörper (Würmer? Unverdaute Futterreste?).

OUTPUT-REGELN (Tonalität & Inhalt):
1.  **Sprache:** Direkt, "Du"-Form, verständlich, aber fachlich fundiert (Willenskraft-Style). Keine Alarmpanik, sondern klare Führung.
2.  **Holistische Erklärung:** Erkläre dem Nutzer *warum* der Kot so aussieht.
3.  **Detaillierte Hilfestellung (Der wichtigste Teil):**
    Für jede erkannte Auffälligkeit (z.B. Schleim, weiche Konsistenz, Farbe) musst du eine strukturierte Erklärung liefern:
    - **Woher kommt es?** (Ursache, z.B. "Dünndarmreizung", "Futterumstellung")
    - **Was macht es?** (Auswirkung, z.B. "Nährstoffe werden nicht absorbiert", "Flüssigkeitsverlust")
    - **Was tun?** (Konkrete Maßnahme, z.B. "Schonkost für 2 Tage", "Tierarzt aufsuchen")
4.  **Lösung (Interne Verlinkung):**
    - Bei leichten Problemen: Verweise auf den **"Futter-Rechner"** (Schonkost).
    - Bei schweren Problemen: **Tierarzt**.

FORMAT (JSON):
Gib die Antwort strikt als JSON zurück:
{
  "bristol_score": number, // 1-7
  "analysis_depth": string, // Zusammenfassende Erklärung
  "detailed_findings": [ // Liste der spezifischen Auffälligkeiten mit Details
    {
      "observation": string, // z.B. "Gelbliche Verfärbung"
      "cause": string, // z.B. "Zu schnelle Darmpassage..."
      "consequence": string, // z.B. "Nährstoffe werden nicht..."
      "advice": string // z.B. "Leicht verdauliche Kost füttern..."
    }
  ],
  "visual_details": string[], // Kurze Schlagworte für Tags
  "status_color": "green" | "yellow" | "red",
  "recommendation_text": string,
  "cta_action": "open_calculator" | "call_vet" | "none"
}
`;

                const response = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: {
                        parts: [
                            { text: systemPrompt },
                            { inlineData: { mimeType: poopImage.type, data: base64Image as string } }
                        ]
                    },
                    config: { responseMimeType: "application/json" }
                });

                const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const result = JSON.parse(cleanText);
                setAnalysisResult(result);

            } catch (e) {
                console.error(e);
                setError('Die Analyse konnte nicht durchgeführt werden. Bitte versuche es erneut.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <>
                <BackButton onBack={() => setView('selection')} />
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Kacki Analyser</h2>
                        <p className="text-gray-600 mt-2">Medizinische Deep-Vision Analyse für maximale Sicherheit.</p>
                    </div>

                    {!analysisResult && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 min-h-[200px]">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Vorschau" className="max-h-64 object-contain rounded-lg shadow-md" />
                                ) : (
                                    <div className="space-y-2 text-center">
                                        <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="text-sm text-gray-600">Foto vom "Häufchen" machen</p>
                                        <p className="text-xs text-gray-500">Wir analysieren Farbe, Textur & Konsistenz</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => cameraInputRef.current?.click()}
                                    className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Kamera
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Galerie
                                </button>
                            </div>
                            <input ref={fileInputRef} type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                            <input ref={cameraInputRef} type="file" className="sr-only" accept="image/*" capture="environment" onChange={handleImageChange} />

                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !poopImage}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                            >
                                {isLoading ? 'Starte Deep Scan...' : 'Jetzt analysieren'}
                            </button>
                            {error && <p className="text-red-600 text-center text-sm">{error}</p>}
                        </div>
                    )}

                    {isLoading && (
                        <div className="mt-10 text-center">
                            <div className="inline-block relative w-20 h-20">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-200 rounded-full animate-ping"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-500 rounded-full animate-spin border-t-transparent"></div>
                            </div>
                            <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">{loadingText}</p>
                        </div>
                    )}

                    {analysisResult && (
                        <div className="mt-8 animate-fade-in-up">
                            {/* Image Display in Result */}
                            {imagePreview && (
                                <div className="mb-8 flex justify-center">
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Analyse-Bild"
                                            className="h-48 w-48 object-cover rounded-xl shadow-lg border-4 border-white"
                                        />
                                        <div className={`absolute -bottom-3 -right-3 px-4 py-1 rounded-full text-sm font-bold shadow-md ${analysisResult.status_color === 'red' ? 'bg-red-500 text-white' :
                                            analysisResult.status_color === 'yellow' ? 'bg-yellow-500 text-white' :
                                                'bg-green-500 text-white'
                                            }`}>
                                            Bristol {analysisResult.bristol_score}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={`p-6 rounded-xl border-l-8 shadow-lg ${analysisResult.status_color === 'red' ? 'bg-red-50 border-red-500' :
                                analysisResult.status_color === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
                                    'bg-green-50 border-green-500'
                                }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">Analyse-Ergebnis</h3>
                                    <button
                                        onClick={() => setShowVoiceAssistant(true)}
                                        className="flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-semibold text-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                        Mit Dr. Vet sprechen
                                    </button>
                                </div>

                                <p className="text-lg text-gray-800 leading-relaxed mb-6 font-medium">
                                    {analysisResult.analysis_depth}
                                </p>

                                {/* Detailed Findings Section */}
                                {analysisResult.detailed_findings && analysisResult.detailed_findings.length > 0 && (
                                    <div className="mb-8 space-y-4">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Detail-Diagnose & Hilfe</h4>
                                        {analysisResult.detailed_findings.map((finding, idx) => (
                                            <div key={idx} className="bg-white bg-opacity-60 rounded-lg p-4 border border-gray-200">
                                                <h5 className="font-bold text-gray-900 mb-2 flex items-center">
                                                    <span className={`w-2 h-2 rounded-full mr-2 ${analysisResult.status_color === 'red' ? 'bg-red-500' : 'bg-amber-500'
                                                        }`}></span>
                                                    {finding.observation}
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Woher kommt's?</span>
                                                        <p className="text-gray-700">{finding.cause}</p>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Was macht's?</span>
                                                        <p className="text-gray-700">{finding.consequence}</p>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Was tun?</span>
                                                        <p className="text-amber-700 font-bold">{finding.advice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Erkannte Merkmale</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.visual_details.map((detail, idx) => (
                                            <span key={idx} className="bg-white px-3 py-1 rounded-md border border-gray-200 text-sm text-gray-700 shadow-sm">
                                                {detail}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-inner">
                                    <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                        Empfehlung
                                    </h4>
                                    <p className="text-gray-700 mb-4">{analysisResult.recommendation_text}</p>

                                    {analysisResult.cta_action === 'open_calculator' && (
                                        <button
                                            onClick={() => setView('calculator')}
                                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold shadow-md transition transform hover:scale-105"
                                        >
                                            Jetzt Schonkost berechnen
                                        </button>
                                    )}

                                    {analysisResult.cta_action === 'call_vet' && (
                                        <a
                                            href="https://www.google.com/search?q=Tierarzt+Notdienst+in+meiner+Nähe"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md transition transform hover:scale-105"
                                        >
                                            Tierarzt-Notdienst suchen
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {showVoiceAssistant && analysisResult && (
                        <VoiceAssistant
                            analysisResult={analysisResult}
                            onClose={() => setShowVoiceAssistant(false)}
                        />
                    )}
                </div>
            </>
        );
    };

    return (
        <PasswordProtection>
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
                <div className="relative z-10">
                    <header className="text-center py-16 px-4">
                        <img src="https://www.willenskraft.co.at/wp-content/uploads/2018/06/Final.-Logo-Hundeschule-Willenskraft.-Gute-Hundeschule-Graz-Gleisdorf.png" alt="Willenskraft Logo" className="mx-auto h-24 w-auto mb-8" />
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                            <span className="text-amber-500">Willenskraft</span> Futter-Rechner
                        </h1>
                        <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">Ganzheitliche & bedarfsgerechte Rationen für Dein gesundes Hundeleben.</p>
                    </header>

                    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                        {view === 'selection' && <SelectionView />}
                        {view === 'calculator' && <CalculatorView />}
                        {view === 'analyzer' && <AnalyzerView />}
                        {view === 'kackiAnalyzer' && <KackiAnalyzerView />}
                    </main>
                </div>
            </div>
        </PasswordProtection>
    );
}

export default App;