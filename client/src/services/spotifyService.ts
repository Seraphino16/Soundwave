export const fetchAlbums = async () => {
    try {
        const response = await fetch(`http://localhost:5001/albums`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des albums");

        const data = await response.json();
        return { albums: data.albums };
    } catch (error) {
        console.error(error);
        return { albums: [] };
    }
};
