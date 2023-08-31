const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST requests', () => {
        test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    "issue_title": "Test issue",
                    "issue_text": "This is a test",
                    "created_by": "Gas10",
                    "assigned_to": "Gas",
                    "status_text": "none"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.body.issue_title, 'Test issue')
                    assert.equal(res.body.issue_text, 'This is a test')
                    assert.equal(res.body.created_by, 'Gas10')
                    assert.equal(res.body.assigned_to, 'Gas')
                    assert.equal(res.body.status_text, 'none')
                    assert.equal(res.body.open, true)
                    assert.isOk(res.body._id)
                    assert.isOk(res.body.created_on)
                    assert.isOk(res.body.updated_on)
                    done()
                })
        })

        test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    "issue_title": "Test issue",
                    "issue_text": "This is a test",
                    "created_by": "Gas10"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.body.issue_title, 'Test issue')
                    assert.equal(res.body.issue_text, 'This is a test')
                    assert.equal(res.body.created_by, 'Gas10')
                    assert.equal(res.body.assigned_to, '')
                    assert.equal(res.body.status_text, '')
                    assert.exists(res.body._id)
                    done()
                })
        })

        test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    "issue_title": "Test issue",
                    "issue_text": "This is a test",
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'required field(s) missing')
                    done();
                })
        })
    })
    suite('GET requests', () => {
        test('View issues on a project: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.exists(res.body[0])
                    assert.exists(res.body[0].issue_title)
                    done()
                })
        })

        test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest')
                .query({ open: true })
                .end((err, res) => {
                    assert.equal(res.body[0].open, true)
                    done()
                })
        })

        test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest')
                .query({ open: true, assigned_to: '' })
                .end((err, res) => {
                    assert.equal(res.body[0].open, true)
                    assert.equal(res.body[0].assigned_to, '')
                    done()
                })
        })
    })
    suite('PUT requests', () => {
        test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: '64f0d52b620b6bc95184bb08', open: false })
                .end((err, res) => {
                    assert.equal(res.status, 200); // Check response status
                    assert.equal(res.body.result, 'successfully updated');
                    assert.exists(res.body._id);
                    done();
                })
        })

        test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: '64f0d52b620b6bc95184bb08', open: false })
                .end((err, res) => {
                    assert.equal(res.status, 200); // Check response status
                    assert.equal(res.body.result, 'successfully updated');
                    assert.exists(res.body._id);
                    done();
                })
        })


        test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ open: false })
                .end((err, res) => {
                    assert.equal(res.body.error, 'missing _id')
                    done()
                })
        })

        test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: '63657911922d375e25ad1b85' })
                .end((err, res) => {
                    assert.equal(res.body.error, 'no update field(s) sent')
                    assert.equal(res.body._id, '63657911922d375e25ad1b85')
                    done()
                })
        })

        test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: 'invalid', open: false })
                .end((err, res) => {
                    assert.equal(res.body.error, 'could not update')
                    assert.equal(res.body._id, 'invalid')
                    done()
                })
        })
    })
    suite('DELETE requests', () => {
        test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({ _id: '63657911922d375e25ad1b85' })
                .end((err, res) => {
                    assert.equal(res.body.result, 'successfully deleted')
                    assert.equal(res.body._id, '63657911922d375e25ad1b85')
                    done()
                })
        })

        test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({ _id: 'INVALID STILL' })
                .end((err, res) => {
                    assert.equal(res.body.error, 'could not delete')
                    assert.equal(res.body._id, 'INVALID STILL')
                    done()
                })
        })

        test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.body.error, 'missing _id')
                    done()
                })
        })
    })

})