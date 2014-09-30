var app = {};

$(document).ready(function() {
  app.Note = Backbone.Model.extend({
    defaults: {
      author: 'James',
      date: Date().toString(),
      title: 'Untitled',
      body: '...'
    }
  });

  app.NoteView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#note-template').html()),

    events: {
      'click .delete-note': 'deleteNote'
    },

    render: function() {
      // Render template and set as current el
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    deleteNote: function() {
      // Destroy the note's model and clear its view
      this.model.destroy();
      this.$el.html('');
    }
  });

  app.NoteList = Backbone.Collection.extend({
    model: app.Note,
    localStorage: new Store('backbone-notes')
  });

  app.AppView = Backbone.View.extend({
    el: '#notes-app',

    initialize: function() {
      // Instance variables for the inputs
      this.title = this.$('#title');
      this.author = this.$('#author');
      this.body = this.$('#body');

      // Create a new collection
      app.noteList = new app.NoteList();

      // Whenever a new item is added to NoteList render its view
      app.noteList.on('add', this.renderNote, this);

      // Fetch all notes from LocalStorage
      app.noteList.fetch();
    },

    events: {
      // Create a new note on button click
      'click .submit': 'createNote'
    },

    renderNote: function(note) {
      var view = new app.NoteView({model: note});
      $('#notes').append(view.render().el);
    },

    createNote: function() {
      app.noteList.create(this.getInputs());
    },

    getInputs: function() {
      return {
        title: this.title.val().trim(),
        author: this.author.val().trim(),
        body: this.body.val().trim()
      };
    }
  });

  app.AppView = new app.AppView();
});
