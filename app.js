// Proper namespacing
window.App = {
  Models: {},
  Collections: {},
  Views: {}
};

$(document).ready(function() {
  App.Models.Note = Backbone.Model.extend({
    defaults: {
      author: 'James',
      date: Date().toString(),
      title: 'Untitled',
      body: '...'
    }
  });

  App.Views.Note = Backbone.View.extend({
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
      // Destroy the note's model and remove its view
      this.model.destroy();
      this.remove();
    }
  });

  App.Collections.Notes = Backbone.Collection.extend({
    model: App.Models.Note,
    localStorage: new Store('backbone-notes')
  });

  App.Views.Notes = Backbone.View.extend({
    el: '#notes-app',

    initialize: function() {
      // Instance variables for the inputs
      this.title = this.$('#title');
      this.author = this.$('#author');
      this.body = this.$('#body');

      // Whenever a new item is added to NoteList render its view
      notesCollection.on('add', this.renderNote, this);

      // Fetch all notes from LocalStorage
      notesCollection.fetch();
    },

    events: {
      // Create a new note on button click
      'click .submit': 'createNote'
    },

    renderNote: function(note) {
      var view = new App.Views.Note({model: note});
      $('#notes').append(view.render().el);
    },

    createNote: function() {
      notesCollection.create(this.getInputs());
    },

    getInputs: function() {
      return {
        title: this.title.val().trim(),
        author: this.author.val().trim(),
        body: this.body.val().trim()
      };
    }
  });

  var notesCollection = new App.Collections.Notes();
  var notesView = new App.Views.Notes({'notesCollection': notesCollection});
});
