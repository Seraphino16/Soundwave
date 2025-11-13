export const fetchAlbums = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/albums`);
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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/album/${id}`);
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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/artists`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des artistes");

        const data = await response.json();
        return { artists: data.artists ?? [] };
    } catch (error) {
        console.error(error);
        return { artists: [] };
    }
};

export const fetchArtistById = async (id: string) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/artist/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'artiste");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchAlbumsByArtistId = async (artistId: string) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/artist/${artistId}/albums`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des albums de l'artiste");

        const data = await response.json();
        return { albums: data.albums ?? [] };
    } catch (error) {
        console.error("Erreur frontend fetchAlbumsByArtistId:", error);
        return { albums: [] };
    }
};

export const searchAlbums = async (filters: { name?: string; year?: string; }) => {
    const query = new URLSearchParams();

    if (filters.name) query.append("name", filters.name);
    if (filters.year) query.append("year", filters.year);

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/albums/search?${query.toString()}`);
        if (!response.ok) throw new Error("Erreur lors de la recherche des albums");

        const data = await response.json();
        return { albums: data.albums ?? [] };
    } catch (error) {
        console.error(error);
        return { albums: [] };
    }
};

export const searchArtists = async (filters: { name?: string; genre?: string }) => {
    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.genre) params.append("genre", filters.genre);

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/artists/search?${params.toString()}`);
        if (!response.ok) throw new Error("Erreur lors de la recherche des artistes");

        const data = await response.json();

        return {
            artists: data.artists ?? [],
        };
    } catch (error) {
        console.error("Erreur frontend searchArtists:", error);
        return { artists: [] };
    }
};

export const fetchAlbumsWithTracksByArtistId = async (artistId: string) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/artist/${artistId}/albums-with-tracks`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des albums avec pistes");

        const data = await response.json();
        return {
            albums: data.albums ?? [],
        };
    } catch (error) {
        console.error("Erreur frontend fetchAlbumsWithTracksByArtistId:", error);
        return { albums: [] };
    }
};
