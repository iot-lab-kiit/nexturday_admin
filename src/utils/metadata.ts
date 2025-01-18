export interface MetaData {
  title: string;
  description: string;
  keywords?: string;
}
export const updateMetadata = (metadata: MetaData) => {
  document.title = `${metadata.title} | Nexterday Admin`;
  let descriptionMeta = document.querySelector('meta[name="description"]');
  if (!descriptionMeta) {
    descriptionMeta = document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    document.head.appendChild(descriptionMeta);
  }
  descriptionMeta.setAttribute('content', metadata.description);
  if (metadata.keywords) {
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.setAttribute('content', metadata.keywords);
  }
}; 