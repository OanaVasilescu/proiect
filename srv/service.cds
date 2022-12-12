using {eespc.app as my} from '../db/schema.cds';

service Service @(path : '/app') {
    entity Pacient as projection on my.Pacient;
    entity Fisa as projection on my.Fisa;
    entity Boala as projection on my.Boala;
    entity Tratament as projection on my.Tratament;
}