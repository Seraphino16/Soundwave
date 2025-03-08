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

export const fetchAlbumById = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:5001/album/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'album");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
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

export const fetchArtistById = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:5001/artist/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'artiste");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};