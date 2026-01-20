export function genSlug(title:string){
    const baseSlug = title
    .toLocaleLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
    // Agr koi blog same h tou yeh 4 letter extra add krdy ga
    // const uniqueLetter = Math.random().toString(36).substring(2,6)
    return `${baseSlug}`

}
// utils/slugGen.js
export function genUrduSlug(title: string) {
  const cleaned = title
    .trim()
    .replace(/\s+/g, '-') // Spaces ko dash mein badlein
    .replace(/[^\u0600-\u06FF0-9\-]/g, '') // Sirf Urdu characters aur numbers rehne dein
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

  return cleaned + '-' + Math.random().toString(36).substring(2, 5);
}