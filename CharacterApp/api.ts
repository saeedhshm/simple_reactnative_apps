
export const BASE_URL = 'https://rickandmortyapi.com/api/character';

export type Character = {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    image: string;
  }

  export type CharacterDetails = Character & {
    type: string;
    gender:string;
    origin: {name:string};
    location :{name: string};
    episode:string[]
    
  }
  
 export  type Info = {
    count: number; pages: number; next: string | null;
  }
  
  export type ApiResponse = {
    info: Info,
    results: Character[]
  }
  
  export const STATUS_COLORS: Record<Character['status'], string> = {
    Alive: '#34c759',
    Dead: '#ff3b30',
    unknown: '#8e8e93',
  };
  