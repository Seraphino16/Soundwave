import React from 'react';

const LegalNotice: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-primaryBlue mb-8">
                    Mentions légales – SoundWave
                </h1>

                {/* Section 1 */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        1. Éditeur du site
                    </h2>
                    <p className="text-gray-700 mb-3">
                        Le présent site est édité par :
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>SoundWave Project</strong>
                    </p>
                    <p className="text-gray-700 mb-3">
                        Projet étudiant réalisé dans le cadre de la formation Web@cadémie d'Epitech.
                    </p>
                    <p className="text-gray-700 mb-2">
                        Responsables de publication : <strong>Augustin Lesaffre, Émilie Le Lan, Zoé Pilia, Stéphane Vaillant, Séraphin Benoit</strong>
                    </p>
                    <p className="text-gray-700">
                        Email de contact : <span className="text-primaryBlue">soundwave.webapp@gmail.com</span>
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        3. Propriété intellectuelle
                    </h2>
                    <p className="text-gray-700 mb-3">
                        L'ensemble des contenus présents sur le site SoundWave, incluant textes, images, logos, 
                        éléments graphiques, vidéos, icônes et logiciels, sont protégés par le droit d'auteur et 
                        les lois relatives à la propriété intellectuelle.
                    </p>
                    <p className="text-gray-700">
                        Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
                        des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sauf 
                        autorisation écrite préalable.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        4. Données personnelles
                    </h2>
                    <p className="text-gray-700 mb-3">
                        SoundWave collecte et traite certaines données personnelles dans le cadre de ses 
                        fonctionnalités (création de compte, réseau social musical, commentaires, référencement 
                        de chansons/artistes/albums).
                    </p>
                    <p className="text-gray-700 mb-3">
                        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
                        Informatique et Libertés, l'utilisateur dispose d'un droit d'accès, de rectification, 
                        de suppression, d'opposition et de portabilité concernant ses données.
                    </p>
                    <p className="text-gray-700 mb-3">
                        Pour exercer ces droits, vous pouvez contacter :<br />
                        Email : <span className="text-primaryBlue">soundwave.webapp@gmail.com</span>
                    </p>
                    <p className="text-gray-700">
                        Aucune information personnelle n'est vendue, louée ou échangée à des tiers.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        5. Cookies
                    </h2>
                    <p className="text-gray-700 mb-3">
                        Le site SoundWave peut être amené à utiliser des cookies pour :
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-3 ml-4">
                        <li>améliorer l'expérience utilisateur,</li>
                        <li>mesurer l'audience,</li>
                        <li>assurer certaines fonctionnalités (connexion, préférences, etc.)</li>
                    </ul>
                    <p className="text-gray-700">
                        L'utilisateur peut configurer son navigateur pour refuser les cookies. Cela peut toutefois 
                        impacter certaines fonctionnalités du site.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        6. Responsabilité
                    </h2>
                    <p className="text-gray-700 mb-3">
                        SoundWave met tout en œuvre pour fournir un site fiable et régulièrement mis à jour. 
                        Toutefois, des erreurs ou omissions peuvent survenir.
                    </p>
                    <p className="text-gray-700 mb-3">
                        Le site peut proposer des liens vers des sites tiers. SoundWave n'exerce aucun contrôle 
                        sur leur contenu et ne peut être tenue pour responsable des dommages résultant de leur 
                        consultation.
                    </p>
                    <p className="text-gray-700">
                        L'utilisateur est seul responsable de l'exactitude des informations qu'il publie sur le 
                        réseau social SoundWave.
                    </p>
                </section>

                {/* Section 7 */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        7. Conditions d'utilisation
                    </h2>
                    <p className="text-gray-700 mb-3">
                        En utilisant ce site, l'utilisateur s'engage à :
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-3 ml-4">
                        <li>respecter la législation en vigueur,</li>
                        <li>ne pas publier de contenus illicites, diffamatoires, haineux ou portant atteinte aux droits d'autrui,</li>
                        <li>ne pas utiliser SoundWave pour des activités frauduleuses ou malveillantes.</li>
                    </ul>
                    <p className="text-gray-700">
                        SoundWave se réserve le droit de supprimer tout contenu ou compte contrevenant à ces règles.
                    </p>
                </section>

                {/* Section 8 */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        8. Modification des mentions légales
                    </h2>
                    <p className="text-gray-700 mb-2">
                        Les présentes mentions légales peuvent être modifiées à tout moment.
                    </p>
                    <p className="text-gray-700">
                        L'utilisateur est invité à les consulter régulièrement.
                    </p>
                </section>

                {/* Section 9 */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        9. Contact
                    </h2>
                    <p className="text-gray-700 mb-2">
                        Pour toute question concernant le site ou les mentions légales :
                    </p>
                    <p className="text-gray-700">
                        Email : <span className="text-primaryBlue">soundwave.webapp@gmail.com</span>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default LegalNotice;
