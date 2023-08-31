'use strict';

module.exports = function (app, Issues) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      const project = req.params.project;
      const filter = { project: project };

      for (let q in req.query) {
        let value = req.query[q];
        if (q === "open") { value = value.toLowerCase() === 'true' }
        filter[q] = value;
      }

      Issues.find(filter).exec()
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          res.status(500).json(err);
        });
    })


    .post(function (req, res) {
      const project = req.params.project;
      if (!(req.body.issue_title && req.body.issue_text && req.body.created_by)) { return res.json({ error: 'required field(s) missing' }) }
      const doc = {
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      }
      Issues.create(doc)
        .then(result => {
          const newEntry = {
            _id: result._id,
            issue_title: result.issue_title,
            issue_text: result.issue_text,
            created_by: result.created_by,
            assigned_to: result.assigned_to,
            status_text: result.status_text,
            created_on: result.created_on,
            updated_on: result.updated_on,
            open: result.open,
          };
          res.json(newEntry);
        })
        .catch(error => {
          res.status(500).json({ error: 'Error creating the issue' });
        });
    })

    .put(async function (req, res) {
      const _id = req.body._id;
      const doc = {};

      for (let i in req.body) {
        if (i !== '_id') {
          if (req.body[i] !== "") {
            doc[i] = req.body[i];
          }
        }
      }

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      if (Object.values(doc).every(el => el === undefined)) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }

      doc.updated_on = new Date().toISOString();

      try {
        const result = await Issues.findByIdAndUpdate(_id, { "$set": doc }).exec();

        if (!result) {
          return res.json({ error: 'could not update', _id: _id });
        }

        res.json({ result: 'successfully updated', '_id': _id });
      } catch (err) {
        res.status(500).json({ error: 'could not update', _id: _id });
      }
    })



    .delete(async function (req, res) {
      const _id = req.body._id;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      if (Array.isArray(_id)) {
        // Delete multiple items
        try {
          const result = await Issues.deleteMany({ _id: { $in: _id } }).exec();
          res.json({ result: 'successfully deleted', _id: _id });
        } catch (err) {
          res.json({ error: 'could not delete', _id: _id });
        }
      } else {
        // Delete a single item
        try {
          const result = await Issues.findByIdAndDelete(_id).exec();
          if (!result) {
            return res.json({ error: 'could not delete', _id: _id });
          }
          res.json({ result: 'successfully deleted', _id: _id });
        } catch (err) {
          res.json({ error: 'could not delete', _id: _id });
        }
      }
    });
};
