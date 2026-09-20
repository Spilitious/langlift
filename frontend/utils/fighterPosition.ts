export const getPjPosition = (
  position: number
): [number, number] => {
  switch (position) {
    case 1: return [10, 10];
        case 2: return [10, 38];
        case 3: return [10, 64];

        case 4: return [18, 10];
        case 5: return [18, 37];
        case 6: return [18, 64];

        case 7: return [40, 10];
        case 8: return [40, 37];
        case 9: return [40, 64];

        default: return [25, 10];

         case 1: return [50, 10];
  }
};

export const getNpcPosition = (
  position: number,
  size:number, 
): [number, number] => {
  if(size ==1)
  {
    switch (position) {
    
    case 1: return [50 ,10];
    case 2: return [50, 37];
    case 3: return [50, 64];

    case 4: return [67, 10];
    case 5: return [67, 37];
    case 6: return [67, 64];

    case 7: return [84, 10];
    case 8: return [84, 37];
    case 9: return [84, 64];

    case 10: return [68, 50];

    default: return [65, 24];
    }
  }
  if(size ==2)
  {
    switch (position) {
        
        case 2: return [50, 50];
        case 5: return [67, 50];
        case 8: return [84, 50];
        default: return [50, 50];
    }
  }
  if(size ==3)
  {
    switch (position) {
        
        case 2: return [50, 50];
        case 5: return [67, 50];
        case 8: return [84, 50];
        default: return [50, 50];
  }
}
 if(size ==4)
  {
    return [60,55];
     
  }


return [67, 37];


};

export const getSizeNpc  = (size:number) => {
    switch(size)
    {
      case 1: return 1;
      case 2: return 1.5;
      case 3: return 2;
      case 4: return 2.5;
      default : return 1;

    }
}