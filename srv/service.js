
const cds = require('@sap/cds/lib')
const { Fisa } = cds.entities('eespc.app')

module.exports = cds.service.impl(srv => {
    // srv.on([
    //     'CREATE', 'UPDATE'
    // ], 'Programare', async (req, next) => {
    //     await next();
    //     console.log(req.data);
    // });
    srv.on('getFiseOfUser', getFiseOfUser);
})

async function getFiseOfUser(req) {
    // const projects = await _allUserProjectsWithQuestions(req);
    // _calculateProgressOfAllProjects(projects);
    // return projects;
    // const tx = cds.transaction(req);
    // read projects with questions expanded
    let db = await cds.connect.to('db')
    let tx = db.tx();

    console.log(req.data);

    const fise = await tx.read(Fisa).where({ pacient_ID: req.data.user });
    return fise;
}
