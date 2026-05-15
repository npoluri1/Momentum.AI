import uuid
from typing import Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from app.config import settings


class VectorStore:
    def __init__(self, collection_name: str = "agent_memory"):
        self.client = chromadb.PersistentClient(
            path=settings.chroma_persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self.collection_name = collection_name
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    async def add_document(
        self,
        content: str,
        metadata: Optional[dict] = None,
        document_id: Optional[str] = None,
    ) -> str:
        doc_id = document_id or str(uuid.uuid4())
        self.collection.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[doc_id],
        )
        return doc_id

    async def add_documents(
        self,
        documents: list[str],
        metadatas: Optional[list[dict]] = None,
        ids: Optional[list[str]] = None,
    ) -> list[str]:
        doc_ids = ids or [str(uuid.uuid4()) for _ in documents]
        self.collection.add(
            documents=documents,
            metadatas=metadatas or [{} for _ in documents],
            ids=doc_ids,
        )
        return doc_ids

    async def search(
        self,
        query: str,
        n_results: int = 5,
        filter_dict: Optional[dict] = None,
    ) -> list[dict]:
        kwargs = {
            "query_texts": [query],
            "n_results": n_results,
        }
        if filter_dict:
            kwargs["where"] = filter_dict

        results = self.collection.query(**kwargs)
        output = []
        if results["ids"]:
            for i in range(len(results["ids"][0])):
                output.append({
                    "id": results["ids"][0][i],
                    "content": results["documents"][0][i] if results["documents"] else "",
                    "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                    "distance": results["distances"][0][i] if results["distances"] else 0,
                })
        return output

    async def delete_document(self, document_id: str):
        self.collection.delete(ids=[document_id])

    async def delete_by_metadata(self, filter_dict: dict):
        results = self.collection.get(where=filter_dict)
        if results["ids"]:
            self.collection.delete(ids=results["ids"])

    async def count(self) -> int:
        return self.collection.count()

    async def get_all(self, filter_dict: Optional[dict] = None) -> list[dict]:
        kwargs = {}
        if filter_dict:
            kwargs["where"] = filter_dict
        results = self.collection.get(**kwargs)
        output = []
        if results["ids"]:
            for i in range(len(results["ids"])):
                output.append({
                    "id": results["ids"][i],
                    "content": results["documents"][i] if results["documents"] else "",
                    "metadata": results["metadatas"][i] if results["metadatas"] else {},
                })
        return output


vector_store = VectorStore()
