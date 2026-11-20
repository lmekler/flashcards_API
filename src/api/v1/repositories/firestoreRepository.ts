// Internal module imports
import { db } from "../../../config/firebaseConfig";
import { FirestoreDataTypes } from "../types/firestore";

interface FieldValuePair {
    fieldName: string;
    fieldValue: FirestoreDataTypes;
}

/**
 * Executes a series of operations within a Firestore transaction.
 * @param {(transaction: FirebaseFirestore.Transaction) => Promise<T>} operations - Function containing the operations to perform within the transaction.
 * @returns {Promise<T>} - The result of the transaction.
 */
export const runTransaction = async <T>(
    operations: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> => {
    try {
        return await db.runTransaction(operations);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Transaction failed: ${errorMessage}`);
    }
};

/**
 * Creates a new document in a specified Firestore collection.
 * Accepts either a collection name or a CollectionReference.
 * @param {string | FirebaseFirestore.CollectionReference} collectionName - The collection name or reference.
 * @param {string} collectionName - The name of the collection.
 * @param {Partial<T>} data - The data for the new document.
 * @returns {Promise<string>} - The ID of the newly created document.
 */
export const createDocument = async <T>(
    collectionName: string | FirebaseFirestore.CollectionReference,
    data: Partial<T>
): Promise<string> => {
    try {
        const collectionRef = typeof collectionName === "string"
            ? db.collection(collectionName)
            : collectionName;

        const docRef = collectionRef.doc();

        await docRef.set(data);
        return docRef.id;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create document in ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Creates a document in a nested Firestore collection.
 * @param {string} parentCollection - The name of the parent collection.
 * @param {string} parentId - The ID of the parent document.
 * @param {string} nestedCollection - The name of the nested collection.
 * @param {Partial<T>} data - The data for the new document.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const createNestedDocument = <T>(
    parentCollection: string,
    parentId: string,
    nestedCollection: string,
    data: Partial<T>,
): Promise<string> => {
    const collectionRef = db
        .collection(parentCollection)
        .doc(parentId)
        .collection(nestedCollection);

    return createDocument<T>(collectionRef, data);
};

/**
 * Retrieves all documents from a specified Firestore collection.
 * Accepts either a collection name or a CollectionReference.
 * @param {string | FirebaseFirestore.CollectionReference} collectionName - The collection name or reference.
 * @returns {Promise<FirebaseFirestore.QuerySnapshot>} - A QuerySnapshot containing all documents.
 */
export const getDocuments = async (
    collectionName: string | FirebaseFirestore.CollectionReference
): Promise<FirebaseFirestore.QuerySnapshot> => {
    try {
        const collectionRef = typeof collectionName === "string"
            ? db.collection(collectionName)
            : collectionName;

        return await collectionRef.get();
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to fetch documents from ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Retrieves all documents from a nested Firestore collection.
 * @param {string} parentCollection - The parent collection name.
 * @param {string} parentId - The parent document ID.
 * @param {string} nestedCollection - The nested collection name.
 * @returns {Promise<FirebaseFirestore.QuerySnapshot>} The documents in the nested collection.
 */
export const getNestedDocuments = (
    parentCollection: string,
    parentId: string,
    nestedCollection: string
): Promise<FirebaseFirestore.QuerySnapshot> => {
    const collectionRef = db
        .collection(parentCollection)
        .doc(parentId)
        .collection(nestedCollection);

    return getDocuments(collectionRef);
};

/**
 * Retrieves a document by its ID from a specified Firestore collection.
 * Accepts either a collection name or a CollectionReference.
 * @param {string | FirebaseFirestore.CollectionReference} collectionName - The collection name or reference.
 * @param {string} id - The ID of the document to retrieve.
 * @returns {Promise<FirebaseFirestore.DocumentSnapshot | null>} - The document or null if it doesn't exist.
 */
export const getDocumentById = async (
    collectionName: string | FirebaseFirestore.CollectionReference,
    id: string
): Promise<FirebaseFirestore.DocumentSnapshot | null> => {
    try {
        const collectionRef = typeof collectionName === "string"
            ? db.collection(collectionName)
            : collectionName;

        const doc: FirebaseFirestore.DocumentSnapshot  = await collectionRef.doc(id).get();
        return doc.exists ? doc : null;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to fetch document ${id} from ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Retrieves a document by ID from a nested Firestore collection.
 * @param {string} parentCollection - The parent collection name.
 * @param {string} parentId - The parent document ID.
 * @param {string} nestedCollection - The nested collection name.
 * @param {string} documentId - The nested document ID.
 * @returns {Promise<FirebaseFirestore.DocumentSnapshot | null>} The document or null if it doesn't exist.
 */
export const getNestedDocumentById = (
    parentCollection: string,
    parentId: string,
    nestedCollection: string,
    documentId: string
): Promise<FirebaseFirestore.DocumentSnapshot | null> => {
    const collectionRef = db
        .collection(parentCollection)
        .doc(parentId)
        .collection(nestedCollection);

    return getDocumentById(collectionRef, documentId);
};

/**
 * Updates an existing document in a specified Firestore collection.
 * Accepts either a collection name or a CollectionReference.
 * @param {string | FirebaseFirestore.CollectionReference} collectionName - The collection name or reference.
 * @param {string} id - The ID of the document to update.
 * @param {Partial<T>} data - The updated document data.
 * @returns {Promise<void>}
 */
export const updateDocument = async <T>(
    collectionName: string | FirebaseFirestore.CollectionReference,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {
        const collectionRef = typeof collectionName === "string"
                ? db.collection(collectionName)
                : collectionName;

        await collectionRef.doc(id).update(data);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to update document ${id} in ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Updates a document in a nested Firestore collection.
 * @param {string} parentCollection - The parent collection name.
 * @param {string} parentId - The parent document ID.
 * @param {string} nestedCollection - The nested collection name.
 * @param {string} documentId - The ID of the document to update.
 * @param {Partial<T>} data - The fields to update.
 * @returns {Promise<void>} Resolves when the document is updated.
 */
export const updateNestedDocument = async <T>(
    parentCollection: string,
    parentId: string,
    nestedCollection: string,
    documentId: string,
    data: Partial<T>
): Promise<void> => {
    const collectionRef = db
        .collection(parentCollection)
        .doc(parentId)
        .collection(nestedCollection);

    return updateDocument<T>(collectionRef, documentId, data);
};

/**
 * Deletes a document from a specified Firestore collection.
 * Can operate within a transaction if provided, otherwise performs a direct delete.
 * Accepts either a collection name or a CollectionReference.
 * @param {string | FirebaseFirestore.CollectionReference} collectionName - The collection name or reference.
 * @param {string} id - The ID of the document to delete.
 * @param {FirebaseFirestore.Transaction} [transaction] - Optional Firestore transaction.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (
    collectionName: string | FirebaseFirestore.CollectionReference,
    id: string,
    transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
    try {
        const collectionRef =
            typeof collectionName === "string"
                ? db.collection(collectionName)
                : collectionName;

        const docRef = collectionRef.doc(id);

        if (transaction) {
            transaction.delete(docRef);
        } else {
            await docRef.delete();
        }
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to delete document ${id} from ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Deletes a document from a nested Firestore collection.
 * @param {string} parentCollection - The parent collection name.
 * @param {string} parentId - The parent document ID.
 * @param {string} nestedCollection - The nested collection name.
 * @param {string} documentId - The ID of the document to delete.
 * @returns {Promise<void>} Resolves when the document is deleted.
 */
export const deleteNestedDocument = (
    parentCollection: string,
    parentId: string,
    nestedCollection: string,
    documentId: string
): Promise<void> => {
    const collectionRef = db
        .collection(parentCollection)
        .doc(parentId)
        .collection(nestedCollection);

    return deleteDocument(collectionRef, documentId);
};

/**
 * Deletes documents from a specified collection based on multiple field values.
 * Can operate within a transaction if provided, otherwise performs a batch delete.
 * @param {string} collectionName - The name of the collection to delete from.
 * @param {FieldValuePair[]} fieldValuePairs - An array of field-value pairs to filter on.
 * @param {FirebaseFirestore.Transaction} [transaction] - Optional Firestore transaction object.
 * @returns {Promise<void>}
 */
export const deleteDocumentsByFieldValues = async (
    collectionName: string,
    fieldValuePairs: FieldValuePair[],
    transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
    try {
        let query: FirebaseFirestore.Query = db.collection(collectionName);

        // Apply all field-value filters
        fieldValuePairs.forEach(({ fieldName, fieldValue }) => {
            query = query.where(fieldName, "==", fieldValue);
        });

        let snapshot: FirebaseFirestore.QuerySnapshot;

        if (transaction) {
            snapshot = await transaction.get(query);
            snapshot.docs.forEach((doc) => {
                transaction.delete(doc.ref);
            });
        } else {
            snapshot = await query.get();
            const batch: FirebaseFirestore.WriteBatch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }
    } catch (error: unknown) {
        const fieldValueString: string = fieldValuePairs
            .map(({ fieldName, fieldValue }) => `${fieldName} == ${fieldValue}`)
            .join(" AND ");
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to delete documents from ${collectionName} where ${fieldValueString}: ${errorMessage}`
        );
    }
};