/**
 * @description Composant Meta pour gérer les métadonnées des pages du site SoundWave
 * @author SoundWave
 * @param {string} title - Titre de la page
 * @param {string} description - Description de la page (par défaut : Page du site SoundWave)
 * @param {string} author - Auteur de la page (par défaut : SoundWave)
 * @param {string} canonicalUrl - URL canonique de la page
 * */

import { Helmet } from "react-helmet-async";

interface MetaProps {
    title: string;
    description?: string;
    author?: string;
    canonicalUrl?: string;
}

const Meta = ({
    title,
    description = "Page du site SoundWave",
    author = "SoundWave",
    canonicalUrl,
}: MetaProps) => (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="author" content={author} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
);

export default Meta;
