namespace eespc.app;

using {
    cuid
} from '@sap/cds/common';

entity Programare: cuid{
    title: String;
    text: String;
    startDate: DateTime;
    endDate: DateTime;
    pacient: Association to one Pacient;
    type: String;
}

entity Pacient : cuid {
    nume: String; 
    prenume: String;
    cnp: String;
    sex: String;
    dataNasterii: String;
    varsta: Integer;
    domiciliu: String;
    judet: String;
    strada: String;
    numar: String;
    bloc: String;
    scara: String;
    etaj: String;
    apartament: String;
    email: String;
    grupSangvin: String;
    greutate: Integer;
    inaltime: Integer;
    alergii: array of {
        alergen: String;
        tip: String
        };
    ocupatie: String;
    fise: Association to many Fisa on fise.pacient = $self;
}

entity Fisa: cuid {
    tipFise: String;
    analize: many {tip: String; text: String; rezultate: String};
    drugs: many {text:String; selected: Boolean};
    boli: many {text:String; selected: Boolean};
    diagnoze: many {text: String; tratament: many {medicament: String; modAdministrare: String; selected:Boolean}; mentiuni: String};
    pacient: Association to Pacient;
    data: DateTime;
}

entity Boala: cuid {
    nume: String;
    tratament: Association to many Tratament on tratament.boala = $self;
}

entity Tratament: cuid {
    medicament: String;
    boala: Association to Boala;
    durataTratament: String;
    pastilaDimineata: Boolean;
    pastilaSeara: Boolean;
    pastilaZiua: Boolean;
    nrPastileDeodata: Integer;
}

entity Alergie: cuid {
    tip: String;
    alergen: String;
}