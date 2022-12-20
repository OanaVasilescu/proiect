sap.ui.define([
    "riskapp/controller/BaseController", "sap/ui/model/json/JSONModel", "riskapp/utils/URLs", 'sap/ui/core/library',
], function (BaseController, JSONModel, URLs, coreLibrary) {
    "use strict";

    var ValueState = coreLibrary.ValueState;
    return BaseController.extend("riskapp.controller.Details", {
        onInit() {
            this.getRouter().getRoute("Details").attachPatternMatched(this.initDetailPage, this);
            this.getView().setModel(new JSONModel(), "pacientModel");
            this.getView().setModel(new JSONModel({editable: false}), "editModel");

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
                ]
            }), "infoModel");
        },

        initDetailPage: async function (oEvent) {
            let selectedPacientId = oEvent.getParameters("arguments").arguments.id;
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
            oView.byId("edit").setVisible(! bEdit);
            oView.byId("save").setVisible(bEdit);
            oView.byId("cancel").setVisible(bEdit);

            // Set the right form type
            this._showFormFragment(bEdit ? "Change" : "Display");
        },

        _getFormFragment: function (sFragmentName) {
            var pFormFragment = this._formFragments[sFragmentName],
                oView = this.getView();

            if (! pFormFragment) {
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
            this.getView().getModel("editModel").setProperty("/editable", ! editable);
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

            if (! sSelectedKey && sValue) {
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
            if (! response) {
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
            return(cnp[12] === hashResult);
        },

        completePacient: function (pacient) {
            if (pacient.cnp) {
                const firstChar = pacient.cnp[0];
                switch (firstChar) {
                    case 1: pacient.sex = M;
                        break;
                    case 2: pacient.sex = F;
                        break;
                    case 5: pacient.sex = M;
                        break;
                    case 6: pacient.sex = F;
                        break;
                    case 7: pacient.sex = M;
                        break;
                    case 8: pacient.sex = F;
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

        addAlergen: function () {
            let alg = this.byId("alergenCB");
            let text = alg.getSelectedItem().getText();
            let tip = alg.getSelectedItem().getAdditionalText()

            let alergii = this.getView().getModel("pacientModel").getProperty("/alergii");
            alergii.push({alergen: text, tip: tip})
            this.getView().getModel("pacientModel").setProperty("/alergii", alergii);
        },

        handleAlergenChange: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();

            if (! sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                oValidatedComboBox.setValueStateText("Please enter an alergen from the list!");
                this.byId("addAlergen").setEnabled(false);
            } else {
                oValidatedComboBox.setValueState(ValueState.None);
                this.byId("addAlergen").setEnabled(true);
            }
        },

        getAlergeni: async function () {
            await this.get(URLs.getAlergeni()).then(async (data) => {
                await this.getView().getModel("infoModel").setProperty("/alergeni", data.value);
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get pacients error");
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
                this.messageHandler("Get alergens error");
            });
        }
    });
});
