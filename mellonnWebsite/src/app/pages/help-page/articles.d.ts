export interface Articles {
    articles: Article[];
}

export interface Article {
    name: string;
    type: "group" | "article";
    prefix: string;
    fileName: string;
    articles: Article[];
}