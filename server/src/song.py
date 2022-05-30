class Song:

    def __init__(self, id, name, artist, score, genre):
        self.id = id
        self.name = name
        self.artist = artist
        self.score = score
        self.genre = genre

    def __lt__(self, obj):
        return ((self.score) < (obj.score))
  
    def __gt__(self, obj):
        return ((self.score) > (obj.score))
  
    def __le__(self, obj):
        return ((self.score) <= (obj.score))
  
    def __ge__(self, obj):
        return ((self.score) >= (obj.score))
  
    def __eq__(self, obj):
        return (self.score == obj.score)
  
    def __repr__(self):
        return str((self.id, self.name, self.score))
 