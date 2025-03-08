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

export const fetchArtists = async () => {
    try {
        const response = await fetch(`http://localhost:5001/artists`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des artistes");

        const data = await response.json();
        return { artists: data.artists };
    } catch (error) {
        console.error(error);
        return { artists: [] };
    }
};
