export interface File{
    type: string;
    // fileType?: string;
    name: string;
    path?: string;
    size?: number;
    last_modified?: string; // datetime?
    id: string;
    folderNavigationParameter?: string;
    previewLink?: string;
    viewLink?: string;
    downloadLink?: string;
    storageProvider: string;
}
