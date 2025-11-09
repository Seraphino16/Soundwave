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
