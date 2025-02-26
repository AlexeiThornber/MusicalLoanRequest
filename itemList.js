/**
 * This enum defines all the different items that can be rented for an event.
 * @name : The name of the item/object.
 * @quantity : The quantity of the item that can be rented.
 */
const itemCategories = ["Sound & Instruments", "Microphones", "Cables"];


export const Sonorisation = Object.freeze({
    FACADE_SCENE: {name : "Façade scène agepoly (2 tops, 2 subs, tâble de mix analogue, 4x speaks-on, 2 pieds)", quantity : 1},
    EV_ACTIF: {name : "EV actives", quantity : 2},
    STAND_EV_ACTIF: {name : "Stands pour EV actives", quantity : 2},
    RCF_ACTIF: {name : "RCF actives", quantity : 2},
    STAND_RCF_ACTIF: {name : "Stands pour RCF actives", quantity : 2},
    BATTERIE_SET : {name : "Batterie set", quantity : 1},
    CLAVIER : {name : "Clavier", quantity : 2},
    TABLE_MIX_ANALOGUE : {name : "Table de mixage analogique (petite)", quantity : 1},
    TABLE_MIX_TF1 : {name : "Tâble de mix TF1", quantity : 1},
    RETOUR_TRIANGULAIRE : {name : "Retours passifs triangulaires", quantity: 4},
    LUTRIN: {name: "Lutrins", quantity : 10}, //Je ne sais pas combien de lutrin on a
    AMPLI_BASSE_SESSION_GRAND : {name : "Ampli basse session grand", quantity : 1},
    AMPLI_BASSE_SESSION_PETIT : {name : "Ampli basse session petit", quantity: 1},
    AMPLI_BASSE_CHAMPION_FENDER : {name : "Ampli basse champion fender", quantity: 1},
    AMPLI_BASSE_GK : {name : "Ampli basse GK", quantity: 1},
    AMPLI_AMPEG : {name : "Ampli ampeg", quantity : 1},
    AMPLI_CUBE_ROUGE : {name : "Ampli cube rouge petit", quantity: 1 },
});

export const Micros = Object.freeze({
    PIED_MICRO: {name : "Pieds de micros", quantity: 8},
    PIED_MICRO_PETIT: {name: "Pied micro petit (sonorisation instrument)", quantity : 1},
    DI : {name: "DI", quantity: 5},
    GROS_MICRO_BLEU : {name : "Gros micro bleu", quantity: 1},
    MICRO_SUPER_PLAT : {name : "Micro super plat", quantity: 1},
    SENNHEISER_E906 : {name : "Sennheiser e906", quantity: 2},
    SM58_CHANT_JACK : {name : "SM58 chant jack", quantity : 1},
    SM58_CHANT_XLR : {name : "SM58 chant XLR", quantity: 5},
    SM57_ISNTRUMENT : {name : "SM57 instrument", quantity: 5},
    AUDIX_SCX25A : {name : "Audix scx25a", quantity: 2},
    AUDIX_MICRO_D : {name : "Audix micro-d (portables)", quantity: 5},
})

export const Cables = Object.freeze({
    XLR : {name: "Câbles XLR", quantity: 32},
    MULTIPRISE: {name: "Multiprises", quantity: 14},
    RALLONGE: {name : "Rallonges", quantity: 10},
    ALIM_SUISSE: {name: "Câble d'alimentation suisse", quantity: 15},
    SPEAK_ON: {name: "Speak-on", quantity : 8},
    ENROULEURS: {name: "Enrouleurs", quantity: 2}
})

//Helper functions
export function keyToValueConverter(key, type){
    switch(type){
        case "Sound & Instruments":
            return Sonorisation[key];
        case "Microphones":
            return Micros[key];
        case "Cables":
            return Cables[key];
    }
}

export function getItem(key){
    for(let cat of itemCategories){
        let res = keyToValueConverter(key, cat);
        if(res !== undefined){
            return res;
        }
    }
}