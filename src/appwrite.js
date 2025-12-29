import {Client, Databases, ID, Query} from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listDocuments({
            databaseId: DATABASE_ID,
            collectionId: COLLECTION_ID,
            queries: [
                Query.equal('searchTerm', searchTerm),
            ]
        });

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            const updateResult = await database.updateDocument({
                databaseId: DATABASE_ID,
                collectionId: COLLECTION_ID,
                documentId: doc.$id,
                data: {
                    count: doc.count + 1
                }
            });
            return updateResult;
        } else {
            const newDoc = {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            };
            const createResult = await database.createDocument({
                databaseId: DATABASE_ID,
                collectionId: COLLECTION_ID,
                documentId: ID.unique(),
                data: newDoc
            });
            return createResult;
        }
    } catch (err) {
        console.error('❌ Error updating search count:', err);
        throw err; // Re-throw so caller knows it failed
    }
};

export const getTrendingMovies = async() => {
    try{
        console.log('🔥 Fetching trending movies...');
        console.log('Database ID:', DATABASE_ID);
        console.log('Collection ID:', COLLECTION_ID);

        const result = await database.listDocuments({
            databaseId: DATABASE_ID,
            collectionId: COLLECTION_ID,
            queries: [
                Query.limit(5),
                Query.orderDesc('count')
            ]
        });

        console.log('📊 Trending movies result:', {
            total: result.total,
            documentsCount: result.documents.length,
            documents: result.documents
        });

        return result.documents;
    }catch(err){
        console.error('❌ Error fetching trending movies:', err);
        return [];
    }
}
