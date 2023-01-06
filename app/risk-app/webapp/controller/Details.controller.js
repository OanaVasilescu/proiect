sap.ui.define([
    "riskapp/controller/BaseController", "sap/ui/model/json/JSONModel", "riskapp/utils/URLs", 'sap/ui/core/library', "sap/ui/core/Fragment",
], function (BaseController, JSONModel, URLs, coreLibrary, Fragment) {
    "use strict";

    var ValueState = coreLibrary.ValueState;
    return BaseController.extend("riskapp.controller.Details", {
        onInit() {
            this.getRouter().getRoute("Details").attachPatternMatched(this.initDetailPage, this);
            this.getView().setModel(new JSONModel(), "pacientModel");
            this.getView().setModel(new JSONModel({ tipFise: null, analize: [], diagnoze: [] }), "fisaModel");
            this.getView().setModel(new JSONModel({ editable: false }), "editModel");

            this.getView().setModel(new JSONModel({
                grSangvina: [
                    {
                        key: 'O',
                        text: 'O'
                    }, {
                        key: 'A',
                        text: 'A'
                    }, {
                        key: 'B',
                        text: 'B'
                    }, {
                        key: 'AB',
                        text: 'AB'
                    }
                ],
                jobs: [
                    {
                        name: "asistent de cercetare"
                    },
                    {
                        name: "caricaturist"
                    },
                    {
                        name: "carmangier"
                    },
                    {
                        name: "cartator postal"
                    }, {
                        name: "cartograf"
                    }, {
                        name: "student"
                    }, {
                        name: "electrician"
                    }, {
                        name: "executor judecatoresc"
                    }, {
                        name: "optician"
                    }, {
                        name: "parasutist"
                    }, {
                        name: "reparator"
                    }, {
                        name: "salubrizor"
                    }, {
                        name: "tâmplar"
                    }, {
                        name: "farmacist"
                    }, {
                        name: "fierar"
                    }, {
                        name: "fizician"
                    }, {
                        name: "gipsar"
                    }, {
                        name: "gardian"
                    }, {
                        name: "geofizician"
                    }, {
                        name: "infirmiera"
                    }, {
                        name: "inginer"
                    }, {
                        name: "inspector"
                    }, {
                        name: "istoriograf"
                    }, {
                        name: "îngrijitor"
                    }, {
                        name: "judecator"
                    }, {
                        name: "lector"
                    }, {
                        name: "lucrator"
                    }, {
                        name: "magician"
                    }, {
                        name: "maseur "
                    }, {
                        name: "medic"
                    }, {
                        name: "ministru"
                    }, {
                        name: "muncitor"
                    }, {
                        name: "operator "
                    }, {
                        name: "vicar"
                    },
                ],
                judete: [
                    "Bucuresti",
                    "Alba",
                    "Arad",
                    "Arges",
                    "Bacau",
                    "Bihor",
                    "Bistrita - Nasaud",
                    "Botosani",
                    "Braila",
                    "Brasov",
                    "Buzau",
                    "Calarasi",
                    "Caras - Severin",
                    "Cluj",
                    "Constanta",
                    "Covasna",
                    "Dambovita",
                    "Dolj",
                    "Galati",
                    "Giurgiu",
                    "Gorj",
                    "Harghita",
                    "Hunedoara",
                    "Ialomita",
                    "Iasi",
                    "Ilfov",
                    "Maramures",
                    "Mehedinti",
                    "Mures",
                    "Neamt",
                    "Olt",
                    "Prahova",
                    "Salaj",
                    "Satu Mare",
                    "Sibiu",
                    "Suceava",
                    "Teleorman",
                    "Timis",
                    "Tulcea",
                    "Valcea",
                    "Vaslui",
                    "Vrancea"
                ],
                tipFise: ["Drugs and medication use", "Family History", "Investigations/Procedures/Medical tests", "Treatment record"],
                isTypeChosen: false,
                editableFise: true,
                invalidProcedures: false,
                chosen: "Treatment record",
                boli: [{ text: "Diabetes", selected: false }, { text: "Hypertension", selected: false }, { text: "Heart disease", selected: false }, { text: "Autoimmune disorders (rheumatoid arthritis, lupus, etc.)", selected: false }, { text: "Kidney disease", selected: false }, { text: "Epilepsy", selected: false }, { text: "Psychiatric disorders", selected: false }, { text: "Hepatitis", selected: false }, { text: "Depression", selected: false }, { text: "Thyroid disease", selected: false }, { text: "Preeclampsia", selected: false }, { text: "Down syndrome", selected: false }, { text: "Any chromosomal abnormality", selected: false }, { text: "Muscular dystrophy", selected: false }, { text: "Neurological disorders", selected: false }, { text: "Cystic fibrosis", selected: false }],
                drugs: [{ text: "Alcohol", selected: false }, { text: "Nicotine", selected: false }, { text: "Antidepressants ", selected: false }, { text: "Dissociative Anesthetics", selected: false }, { text: "Hallucinogens", selected: false }, { text: "Antipsychotics/Anticonvulsants", selected: false }, { text: "Anabolic Steroids", selected: false }, { text: "Cannabinoids", selected: false }, { text: "Sedative", selected: false }, { text: "Opioids", selected: false }, { text: "Stimulants", selected: false }],
                analize: [{ text: "Spirometrii", tip: "Explorări funcţionale" }, { text: "Teste de reversibilitate bronșică", tip: "Explorări funcţionale" }, { text: "Testarea difuziunii prin membrana alveolo-capilară", tip: "Explorări funcţionale" }, { text: "Testarea cardio-pulmonară complexă la efort", tip: "Explorări funcţionale" }, { text: "Electrocardiografii", tip: "Explorări funcţionale" }, { text: "EKG", tip: "Explorări funcţionale" }, { text: "Audiometria", tip: "Explorări funcţionale" }, { text: "Glucotest", tip: "Explorări funcţionale" }, { text: "Holter monitorizare tensiune arterială - 24 ore", tip: "Explorări funcţionale" }, { text: "Oscilometrie", tip: "Explorări funcţionale" }, { text: "Colposcopie", tip: "Explorări funcţionale" },
                { text: "Radiografia dentara", tip: "Investigaţii radiologice" }, { text: "Radiografia organelor ale aparatului respirator si toracelui", tip: "Investigaţii radiologice" }, { text: "Radiografia craniului si a creierului", tip: "Investigaţii radiologice" }, { text: "Radiografia coloanei vertebrale", tip: "Investigaţii radiologice" }, { text: "Mamografia", tip: "Investigaţii radiologice" }, { text: "Alte radiografii cu substante de contrast", tip: "Investigaţii radiologice" },
                { text: "Îndepartarea de corpuri straine", tip: "Alte proceduri terapeutice" }, { text: "Evacuarea continutului tractului digestiv", tip: "Alte proceduri terapeutice" }, { text: "Evacuarea continutului aparatului excretor", tip: "Alte proceduri terapeutice" }, { text: "Aspiratii terapeutice", tip: "Alte proceduri terapeutice" }, { text: "Evacuare cu siringa, prin insuflare, irigare", tip: "Alte proceduri terapeutice" }, { text: "Spalarea si îngrijirea ranilor: taiate, muscate, întepate", tip: "Alte proceduri terapeutice" }, { text: "Corectarea fracturilor si dislocatiilor", tip: "Alte proceduri terapeutice" }, { text: "Manipularea fetusului sau a uterului cu sarcina", tip: "Alte proceduri terapeutice" }, { text: "Hidroterapia si aeroterapia", tip: "Alte proceduri terapeutice" },
                { text: "APTT", tip: "Analize de laborator" }, { text: "Crioglobuline", tip: "Analize de laborator" }, { text: "Determinare de grup sanguin ABO", tip: "Analize de laborator" }, { text: "V.S.H.", tip: "Analize de laborator" }, { text: "Acid uric seric", tip: "Analize de laborator" }, { text: "Bilirubina totala", tip: "Analize de laborator" }, { text: "Colesterol seric total", tip: "Analize de laborator" }, { text: "Calciu ionic seric", tip: "Analize de laborator" }, { text: "HDL colesterol", tip: "Analize de laborator" }, { text: "ASLO cantitativ", tip: "Analize de laborator" }, { text: "Proteina  C  reactivă", tip: "Analize de laborator" }, { text: "AFP-Alfafetoproteina", tip: "Analize de laborator" }, { text: "Anticorpi HCV", tip: "Analize de laborator" }, { text: "Antigen Helicobacter Pylori IgG", tip: "Analize de laborator" }, { text: "Depistare rotavirus/adenovirus", tip: "Analize de laborator" }, { text: "Examen  microscopic  colorat", tip: "Analize de laborator" }
                ],
                tipuriChestii: ["Investigaţii radiologice", "Explorări funcţionale", "Alte proceduri terapeutice", "Analize de laborator"],
                diagnoze: [{ text: "Holera", tratament: [{ medicament: "Azitromicină", modAdministrare: "2/zi", selected: false }, { medicament: "Ciprofloxacina", modAdministrare: "2/zi", selected: false }] },
                { text: "Febra tifoida", tratament: [{ medicament: "Biseptol", modAdministrare: "2/zi", selected: false }, { medicament: "Ampicilină", modAdministrare: "1/zi", selected: false }, { medicament: "Amoxicilină", modAdministrare: "1/zi", selected: false }] },
                { text: "Varicela", tratament: [{ medicament: "Ibuprofen", modAdministrare: "2/zi", selected: false }] },
                { text: "Oreion", tratament: [{ medicament: "Ibuprofen", modAdministrare: "2/zi", selected: false }, { medicament: "Paracetamol", modAdministrare: "2/zi", selected: false }] },
                { text: "Anemie", tratament: [{ medicament: "Lactiferon", modAdministrare: "1/zi", selected: false }] },
                { text: "Sindromul Cushing", tratament: [{ medicament: "Ketoconazol", modAdministrare: "2/zi", selected: false }, { medicament: "Metopirona", modAdministrare: "2/zi", selected: false }] },]
            }), "infoModel");
        },

        initDetailPage: async function (oEvent) {
            let selectedPacientId = oEvent.getParameters("arguments").arguments.id;
            let edit = oEvent.getParameters("arguments").arguments.edit;

            if (edit) {
                this.getView().getModel("editModel").setProperty("/editable", true);
            }

            await this.getPacient(selectedPacientId);
            await this.getAlergeni();
        },


        navigateBack: function () {
            this.getRouter().navTo("RouteOverview")
        },

        handleEditPress: function () { // Clone the data
            this._oSupplier = Object.assign({}, this.getView().getModel("pacientModel").getData());
            this._toggleButtonsAndView(true);

        },

        handleCancelPress: function () { // Restore the data
            var oModel = this.getView().getModel("pacientModel");
            var oData = oModel.getData();

            oData = this._oSupplier;

            oModel.setData(oData);
            this._toggleButtonsAndView(false);

        },

        preparePacient: function (pacient) {
            delete pacient.fise;
            delete pacient["@odata.context"];
            return pacient;
        },

        handleSavePress: async function () {
            var oModel = this.getView().getModel("pacientModel");
            var oData = oModel.getData();

            let data = this.preparePacient(oData);

            await this.put("/app/Pacient" + '/' + data.ID, data).then(async (data) => {
                this.getPacient(data.ID)
            }).catch((err) => {
                this.messageHandler("Pacient error");
                return "error";
            });

            this._toggleButtonsAndView(false);

        },

        _toggleButtonsAndView: function (bEdit) {
            var oView = this.getView();

            // Show the appropriate action buttons
            // oView.byId("edit").setVisible(!bEdit);
            // oView.byId("save").setVisible(bEdit);
            // oView.byId("cancel").setVisible(bEdit);

            // Set the right form type
            this._showFormFragment(bEdit ? "Change" : "Display");
        },

        _getFormFragment: function (sFragmentName) {
            var pFormFragment = this._formFragments[sFragmentName],
                oView = this.getView();

            if (!pFormFragment) {
                pFormFragment = Fragment.load({
                    id: oView.getId(),
                    name: "sap.ui.layout.sample.SimpleForm_Column_oneGroup234." + sFragmentName
                });
                this._formFragments[sFragmentName] = pFormFragment;
            }

            return pFormFragment;
        },

        _showFormFragment: function (sFragmentName) {
            // var oPage = this.byId("page");

            // oPage.removeAllContent();
            // this._getFormFragment(sFragmentName).then(function (oVBox) {
            //     oPage.insertContent(oVBox);
            // });

            let editable = this.getView().getModel("editModel").getProperty("/editable");
            this.getView().getModel("editModel").setProperty("/editable", !editable);
        },

        greutateChange: function () {
            let state = this.byId("greutate").getValue();
            if (state < 0 || state > 400) {
                this.byId("save").setEnabled(false);
            } else {
                this.byId("save").setEnabled(true);
            }
        },

        inaltimeChange: function () {
            let state = this.byId("inaltime").getValue();
            if (state < 0 || state > 300) {
                this.byId("save").setEnabled(false);
            } else {
                this.byId("save").setEnabled(true);
            }
        },

        handleJudetChange: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();

            if (!sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                oValidatedComboBox.setValueStateText("Please enter a valid county!");
                this.byId("save").setEnabled(false);
            } else {
                oValidatedComboBox.setValueState(ValueState.None);
                this.byId("save").setEnabled(true);
            }
        },

        changeCNP: function () {
            let input = this.byId("cnpInput").getValue();
            let response = this.validCNP(input);
            if (!response) {
                this.byId("cnpInput").setValueState('Error')
                this.byId("cnpInput").setValueStateText('The given CNP is not meeting hash requirements.')

                this.byId("save").setEnabled(false);
            } else {
                this.byId("cnpInput").setValueState('None')
                let oModel = this.getView().getModel("pacientModel").getData();
                this.byId("save").setEnabled(true);

                oModel.cnp = input;
                let pacient = this.completePacient(oModel);
                this.getView().getModel("pacientModel").setData(pacient);
            }
        },

        changeEmail: function () {
            let email = this.byId("email").getValue();
            var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            if (re.test(email)) {
                this.byId("email").setValueState('None')
                this.byId("save").setEnabled(true);
            } else {
                this.byId("save").setEnabled(false);
                this.byId("email").setValueState('Error')
                this.byId("email").setValueStateText('Invalid Email.')
            }
        },

        validCNP: function (p_cnp) {
            var i = 0,
                year = 0,
                hashResult = 0,
                cnp = [],
                hashTable = [
                    2,
                    7,
                    9,
                    1,
                    4,
                    6,
                    3,
                    5,
                    8,
                    2,
                    7,
                    9
                ];
            if (p_cnp.length !== 13) {
                return false;
            }
            for (i = 0; i < 13; i++) {
                cnp[i] = parseInt(p_cnp.charAt(i), 10);
                if (isNaN(cnp[i])) {
                    return false;
                }
                if (i < 12) {
                    hashResult = hashResult + (cnp[i] * hashTable[i]);
                }
            }
            hashResult = hashResult % 11;
            if (hashResult === 10) {
                hashResult = 1;
            }
            year = (cnp[1] * 10) + cnp[2];
            switch (cnp[0]) {
                case 1:
                case 2:
                    {
                        year += 1900;
                    }
                    break;
                case 3:
                case 4:
                    {
                        year += 1800;
                    }
                    break;
                case 5:
                case 6:
                    {
                        year += 2000;
                    }
                    break;
                case 7:
                case 8:
                case 9:
                    {
                        year += 2000;
                        if (year > (parseInt(new Date().getYear(), 10) - 14)) {
                            year -= 100;
                        }
                    }
                    break;
                default:
                    {
                        return false;
                    }
            }
            if (year < 1800 || year > 2099) {
                return false;
            }
            return (cnp[12] === hashResult);
        },

        completePacient: function (pacient) {
            if (pacient.cnp) {
                const firstChar = pacient.cnp[0];
                switch (firstChar) {
                    case "1": pacient.sex = "M";
                        break;
                    case "2": pacient.sex = "F";
                        break;
                    case "5": pacient.sex = "M";
                        break;
                    case "6": pacient.sex = "F";
                        break;
                    case "7": pacient.sex = "M";
                        break;
                    case "8": pacient.sex = "F";
                        break;
                    default:
                        break;
                }
                let an = pacient.cnp.substring(1, 3);
                if (firstChar == 1 || firstChar == 2) {
                    an = 19 + an;
                }
                if (firstChar == 5 || firstChar == 6) {
                    an = 20 + an;
                }

                if (firstChar == 7 || firstChar == 8) {
                    an = 20 + an;
                }
                if (firstChar == 3 || firstChar == 4) {
                    an = 18 + an;
                }

                let luna = pacient.cnp.substring(3, 5);

                switch (luna) {
                    case '01': luna = 'Jan';
                        break;
                    case '02': luna = 'Feb';
                        break;
                    case '03': luna = 'Mar';
                        break;
                    case '04': luna = 'Apr';
                        break;
                    case '05': luna = 'May';
                        break;
                    case '06': luna = 'Jun';
                        break;
                    case '07': luna = 'Jul';
                        break;
                    case '08': luna = 'Aug';
                        break;
                    case '09': luna = 'Sep';
                        break;
                    case '10': luna = 'Oct';
                        break;
                    case '11': luna = 'Nov';
                        break;
                    case '12': luna = 'Dec';
                        break;
                    default:
                        break;
                }

                let zi = pacient.cnp.substring(5, 7);

                let total = zi + " " + luna + " " + an;

                pacient.dataNasterii = total;

                let varsta = new Date().getFullYear() - an;

                pacient.varsta = varsta;
                return pacient;
            } else {
                return pacient;
            }
        },

        checkSelectFamily: function () {
            let boli = this.getView().getModel("infoModel").getProperty("/boli");
            let filtered = boli.filter(el => el.selected);
            if (filtered.length) {
                this.getView().byId("saveCeva").setEnabled(true);
            } else {
                this.getView().byId("saveCeva").setEnabled(false);
            }
        },

        checkSelect: function () {
            let boli = this.getView().getModel("infoModel").getProperty("/drugs");
            let filtered = boli.filter(el => el.selected);
            if (filtered.length) {
                this.getView().byId("saveCeva").setEnabled(true);
            } else {
                this.getView().byId("saveCeva").setEnabled(false);
            }
        },

        addFisa: function () {
            this.getView().getModel("infoModel").setProperty("/editableFise", true);

            let oView = this.getView();
            if (!this._Popover) {
                this._Popover = Fragment.load({ id: oView.getId(), name: "riskapp.view.fragments.Fisa", controller: this }).then(function (oLegendPopover) {
                    oView.addDependent(oLegendPopover);
                    return oLegendPopover;
                });
            }

            this._Popover.then((oLegendPopover) => {
                if (oLegendPopover.isOpen()) {
                    oLegendPopover.close();
                } else {
                    oLegendPopover.open();
                    this.getView().byId("saveCeva").setEnabled(false);
                }
            });
        },

        addInvestigation: function () {
            let alg = this.byId("InvestigationCB");
            if (alg.getSelectedItem()) {
                let text = alg.getSelectedItem().getText();
                let tip = alg.getSelectedItem().getAdditionalText()

                let investigatii = this.getView().getModel("fisaModel").getProperty("/analize");

                let foundInvestigatie = investigatii.find(el => el.text == text);

                if (foundInvestigatie) {
                    this.messageHandler("This investigation is already added.")
                } else {
                    investigatii.push({ text: text, tip: tip });
                    this.getView().getModel("fisaModel").setProperty("/analize", investigatii);
                }

                alg.setSelectedItem(null);
                this.getView().byId("saveCeva").setEnabled(true);

            }
        },

        removeInvestigation: function (oEvent) {
            let analize = this.getView().getModel("fisaModel").getProperty("/analize");

            let path = oEvent.getSource().getBindingContext("fisaModel").getPath();
            let thing = this.getView().getModel("fisaModel").getProperty(path);

            let filtered = analize.filter(el => el !== thing);
            this.getView().getModel("fisaModel").setProperty("/analize", filtered);
            if (filtered.length == 0) {
                this.getView().byId("saveCeva").setEnabled(false);
            }
        },

        addNewInvestigation: function () {
            let alg = this.byId("InvestigationCB");
            let cv = this.byId("tipSelect");

            let newText = alg.getValue();
            let tip = cv.getSelectedItem().getText();

            let analize = this.getView().getModel("infoModel").getProperty("/analize");
            analize.push({ text: newText, tip: tip });

            this.getView().getModel("infoModel").setProperty("/analize", analize);

            let investigatii = this.getView().getModel("fisaModel").getProperty("/analize");

            investigatii.push({ text: newText, tip: tip });
            this.getView().getModel("fisaModel").setProperty("/analize", investigatii);

            alg.setValueState("None");
            alg.setValue("");

            this.getView().getModel("infoModel").setProperty("/invalidProcedures", false);
        },

        handleInvestigationChange: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();

            if (!sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                oValidatedComboBox.setValueStateText("Please choose from the list!");
                this.byId("addInvestigation").setEnabled(false);

                this.getView().getModel("infoModel").setProperty("/invalidProcedures", true);
            } else {
                oValidatedComboBox.setValueState(ValueState.None);
                this.byId("addInvestigation").setEnabled(true);
                this.getView().getModel("infoModel").setProperty("/invalidProcedures", false);
            }
        },

        addDiagnoze: function () {
            let alg = this.byId("DiagnosisCB");
            if (alg.getSelectedItem()) {
                let text = alg.getSelectedItem().getText();
                let tip = alg.getSelectedItem().getAdditionalText()

                let all = this.getView().getModel("infoModel").getProperty("/diagnoze").find(el => el.text == text);
                let investigatii = this.getView().getModel("fisaModel").getProperty("/diagnoze");
                let foundInvestigatie = investigatii.find(el => el.text == text);

                if (foundInvestigatie) {
                    this.messageHandler("This diagnosis is already added.")
                } else {
                    all.mentiuni = "";
                    investigatii.push(all);
                    this.getView().getModel("fisaModel").setProperty("/diagnoze", investigatii);
                }

                alg.setSelectedItem(null);
                this.getView().byId("saveCeva").setEnabled(true);
            }
        },

        removeDiagnoze: function (oEvent) {
            let analize = this.getView().getModel("fisaModel").getProperty("/diagnoze");

            let path = oEvent.getSource().getBindingContext("fisaModel").getPath();
            let thing = this.getView().getModel("fisaModel").getProperty(path);

            let filtered = analize.filter(el => el !== thing);
            this.getView().getModel("fisaModel").setProperty("/diagnoze", filtered);
            if (filtered.length == 0) {
                this.getView().byId("saveCeva").setEnabled(false);
            }
        },

        handleDiagnozeChange: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();

            if (!sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                oValidatedComboBox.setValueStateText("Please choose from the list!");
                this.byId("addDiagnoze").setEnabled(false);
            } else {
                oValidatedComboBox.setValueState(ValueState.None);
                this.byId("addDiagnoze").setEnabled(true);
            }
        },


        handleDialogOkButton: function () {
            this.getView().getModel("infoModel").setProperty("/isTypeChosen", true);
            let chosen = this.getView().getModel("infoModel").getProperty("/chosen");
            this.getView().getModel("fisaModel").setProperty("/tipFise", chosen);
        },

        handleDialogSaveButton: async function () {
            let boli = this.getView().getModel("infoModel").getProperty("/boli");
            let drugs = this.getView().getModel("infoModel").getProperty("/drugs");

            let fisaModel = this.getView().getModel("fisaModel");
            let fisa = fisaModel.getData();

            let id = this.getView().getModel("pacientModel").getData().ID;
            fisa.pacient_ID = id;
            fisa.data = new Date();
            fisa.boli = boli;
            fisa.drugs = drugs;

            await this.post("/app/Fisa", fisa).then(async (data) => {
                // this.getFise();
                this.getPacient(fisa.pacient_ID);
            }).catch((err) => {
                this.messageHandler("Pacient error");
                return "error";
            });

            this.clearFisaDialog();
            this.byId("fisaDialog").close();
        },

        handleDialogCancelButton: function () {
            this.clearFisaDialog();
            this.byId("fisaDialog").close();
        },

        clearFisaDialog: function () {
            this.getView().getModel("infoModel").setProperty("/isTypeChosen", false);
            this.getView().getModel("infoModel").setProperty("/editableFise", true);
            this.getView().getModel("infoModel").setProperty("/invalidProcedures", false);


            let boli = this.getView().getModel("infoModel").getProperty("/boli");
            boli.forEach(boala => {
                boala.selected = false;
            });
            this.getView().getModel("infoModel").setProperty("/boli", boli);

            let drugs = this.getView().getModel("infoModel").getProperty("/drugs");
            drugs.forEach(drug => {
                drug.selected = false;
            });
            this.getView().getModel("infoModel").setProperty("/drugs", drugs);

            this.getView().getModel("fisaModel").setProperty("/analize", []);
            this.getView().getModel("fisaModel").setProperty("/diagnoze", []);
            this.getView().getModel("fisaModel").setProperty("/tipFise", "");
            this.getView().getModel("fisaModel").setProperty("/drugs", []);
            this.getView().getModel("fisaModel").setProperty("/boli", []);

            this.getView().byId("saveCeva").setEnabled(false);

        },

        pressHistory: function (oEvent) {
            var oView = this.getView();

            this.getView().getModel("infoModel").setProperty("/editableFise", false);


            let path = oEvent.getSource().getBindingContext("pacientModel").getPath();
            let data = this.getView().getModel("pacientModel").getProperty(path);
            this.getView().getModel("infoModel").setProperty("/isTypeChosen", true);
            this.getView().getModel("infoModel").setProperty("/chosen", data.tipFise);


            this.getView().getModel("fisaModel").setProperty("/analize", data.analize);

            let boli = this.getView().getModel("infoModel").getProperty("/boli");
            let mapped = boli.map(a => {
                let found = data.boli.find(el => el.text == a.text)
                if (found) {
                    a.selected = found.selected;
                }
                return a;
            })
            this.getView().getModel("infoModel").setProperty("/boli", mapped);

            this.getView().getModel("fisaModel").setProperty("/diagnoze", data.diagnoze);

            let drugs = this.getView().getModel("infoModel").getProperty("/drugs");
            mapped = drugs.map(a => {
                let found = data.drugs.find(el => el.text == a.text)
                if (found) {
                    a.selected = found.selected;
                }
                return a;
            })
            this.getView().getModel("infoModel").setProperty("/drugs", mapped);

            if (!this._Popover) {
                this._Popover = Fragment.load({ id: oView.getId(), name: "riskapp.view.fragments.Fisa", controller: this }).then(function (oLegendPopover) {
                    oView.addDependent(oLegendPopover);
                    return oLegendPopover;
                });
            }

            this._Popover.then(function (oLegendPopover) {
                if (oLegendPopover.isOpen()) {
                    oLegendPopover.close();
                } else {
                    oLegendPopover.open();
                }
            });
        },

        addAlergen: function () {
            let alg = this.byId("alergenCB");
            let text = alg.getSelectedItem().getText();
            let tip = alg.getSelectedItem().getAdditionalText()

            let alergii = this.getView().getModel("pacientModel").getProperty("/alergii");

            let foundAlergen = alergii.find(el => el.alergen == text);

            if (foundAlergen) {
                this.messageHandler("The pacient is already registered with this alergy")
            } else {
                alergii.push({ alergen: text, tip: tip })
                this.getView().getModel("pacientModel").setProperty("/alergii", alergii);
            }

            alg.setSelectedItem(null);
        },

        removeAlergen: function (oEvent) {
            let alergii = this.getView().getModel("pacientModel").getProperty("/alergii");

            let path = oEvent.getSource().getBindingContext("pacientModel").getPath();
            let thing = this.getView().getModel("pacientModel").getProperty(path);

            let filtered = alergii.filter(el => el !== thing);
            this.getView().getModel("pacientModel").setProperty("/alergii", filtered);
        },

        handleAlergenChange: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();

            if (!sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                oValidatedComboBox.setValueStateText("Please enter an alergen from the list!");
                this.byId("addAlergen").setEnabled(false);
            } else {
                oValidatedComboBox.setValueState(ValueState.None);
                this.byId("addAlergen").setEnabled(true);
            }
        },

        getFise: async function () {
            let id = this.getView().getModel("pacientModel").getData().ID;
            await this.get("/app/getFiseOfUser(user='" + id + "')").then(async (data) => {
                this.getPacient(id)
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get reports error");
            });
        },

        getAlergeni: async function () {
            await this.get(URLs.getAlergeni()).then(async (data) => {
                await this.getView().getModel("infoModel").setProperty("/alergeni", data.value);
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get alergens error");
            });
        },

        getPacient: async function (id) {
            await this.get(URLs.getPacientUrl() + "/" + id + "?&$expand=fise").then(async (data) => {
                let completedData;
                completedData = this.completePacient(data);
                await this.getView().getModel("pacientModel").setData(completedData);
                this.byId('edit').setEnabled(true);
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get pacient error");
            });
        }
    });
});
