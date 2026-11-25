/* The stories: one short English story for each target (same order and ids as the other parts), five pages each.
   Every page is one short sentence full of the target sound: [sentence, picture]. Recording numbers come from the
   order: story 1 has 1-5, story 2 has 6-10, and so on. Pictures use ../phrases/assets/pictures.js. */
window.ArticulationData = (() => {
  const positions = [{ id: 'pages', name: 'Story pages', example: 'Listens to each page and says it' }, { id: 'retell', name: 'Retelling', example: 'Puts the pictures in order and tells the story' }];
  const STORIES = [
    ["p", "p", "The P sound", "pig", "Pip the Puppy", [
      ["Pip is a happy puppy.", ["one", "puppy", "happy"]],
      ["Pip sees a pink pig.", ["two", "puppy", "pig"]],
      ["The pig has a pear and a peach.", ["and", "pear", "peach"]],
      ["Pip and the pig eat pie.", ["act", "puppy", "eat", "pie"]],
      ["Pip naps by the pool.", ["at", "puppy", "pool", "sleep"]]]],
    ["b", "b", "The B sound", "ball", "The Big Blue Ball", [
      ["Ben has a big blue ball.", ["act", "boy", "hold", "ball"]],
      ["The ball bounces to a bear.", ["two", "ball", "bear"]],
      ["The bear bats the ball to a bee.", ["two", "bear", "bee"]],
      ["The bee buzzes the ball to the boat.", ["two", "bee", "boatword"]],
      ["Ben gets his ball back.", ["act", "boy", "play", "ball"]]]],
    ["t", "t", "The T sound", "tiger", "Tess the Turtle", [
      ["Tess is a tiny turtle.", ["small", "turtle"]],
      ["Tess wants to eat a tomato.", ["two", "turtle", "tomato"]],
      ["A tall tiger takes the tomato.", ["act", "tiger", "hold", "tomato"]],
      ["Tess tells the tiger to share.", ["two", "turtle", "tiger"]],
      ["They eat the tomato together.", ["two", "tiger", "turtle", "garden"]]]],
    ["d", "d", "The D sound", "dog", "Dan and the Dog", [
      ["Dan has a dog named Dot.", ["two", "boy", "dog"]],
      ["Dot digs in the garden.", ["at", "dog", "garden"]],
      ["Dot finds a doll.", ["two", "dog", "doll"]],
      ["Dan and Dot give the doll to Dad.", ["act", "father", "hold", "doll"]],
      ["Dot sleeps on Dan’s bed.", ["on", "dog", "bed"]]]],
    ["k", "k", "The K sound", "cake", "The King’s Cake", [
      ["The king makes a cake.", ["two", "king", "cake"]],
      ["A cat comes to the kitchen.", ["at", "cat", "kitchen"]],
      ["The cat licks the cake!", ["act", "cat", "eat", "cake"]],
      ["The king cuts a new cake.", ["act", "king", "hold", "cake"]],
      ["The king and the cat eat cake.", ["two", "king", "cat"]]]],
    ["g", "g", "The G sound", "goat", "The Goat and the Gift", [
      ["A gray goat lives in a garden.", ["at", "goat", "garden"]],
      ["The goat gets a big gift.", ["two", "goat", "gift"]],
      ["In the gift is a green egg.", ["in", "egg", "emptybox"]],
      ["A little goose comes out of the egg!", ["two", "goose", "egg"]],
      ["The goat and the goose are good friends.", ["two", "goat", "goose"]]]],
    ["m", "m", "The M sound", "moon", "Max the Mouse", [
      ["Max is a little mouse.", ["small", "mouse"]],
      ["Max looks at the moon.", ["at", "mouse", "night"]],
      ["Max wants some milk.", ["two", "mouse", "milk"]],
      ["Mom mouse makes a muffin.", ["two", "mouse", "cake"]],
      ["Max munches the muffin.", ["act", "mouse", "eat", "cake"]]]],
    ["n", "n", "The N sound", "nose", "Nina’s Nest", [
      ["Nina finds a nest.", ["two", "kidgirl", "nest"]],
      ["In the nest are nine eggs.", ["in", "egg", "nest"]],
      ["The sun shines on the nest.", ["at", "nest", "sky", "shine"]],
      ["Now the eggs open!", ["two", "chick", "egg"]],
      ["Nina names the new chicks.", ["two", "kidgirl", "chick"]]]],
    ["ng", "ng", "The NG sound", "king", "The Singing King", [
      ["The king likes singing.", ["one", "king", "sing"]],
      ["He sings on the swing.", ["act", "king", "ride", "swingword"]],
      ["A bird is singing too.", ["two", "king", "dovebird"]],
      ["The king gives the bird a ring.", ["act", "king", "hold", "ring"]],
      ["Now they are singing a long song.", ["two", "king", "dovebird", "garden"]]]],
    ["f", "f", "The F sound", "fish", "Fred the Fish", [
      ["Fred is a funny fish.", ["one", "fish", "happy"]],
      ["Fred finds a feather.", ["two", "fish", "feather"]],
      ["A fox wants the feather.", ["two", "fox", "feather"]],
      ["Fred gives the fox the feather.", ["act", "fox", "hold", "feather"]],
      ["Fred and the fox are friends forever.", ["two", "fish", "fox"]]]],
    ["v", "v", "The V sound", "van", "Vic’s Van", [
      ["Vic has a very big van.", ["two", "man", "van"]],
      ["Vic drives the van to the river.", ["at", "van", "river"]],
      ["Vic sees a dove by the river.", ["two", "man", "dovebird"]],
      ["The dove gives Vic a violet flower.", ["act", "dovebird", "hold", "flowerword"]],
      ["Vic puts the flower in a vase.", ["in", "flowerword", "vase"]]]],
    ["th", "th", "The TH sound (thumb)", "thumb", "Theo’s Bath", [
      ["Theo is three.", ["one", "boy", "happy"]],
      ["Theo is thirsty after he plays.", ["one", "boy"]],
      ["Theo takes a bath.", ["in", "boy", "bathtub"]],
      ["Theo brushes his teeth with his toothbrush.", ["act", "boy", "hold", "toothbrush"]],
      ["Theo thanks his mother and goes to sleep.", ["two", "mother", "boy"]]]],
    ["dh", "th", "The TH sound (feather)", "feather", "My Brother and the Feather", [
      ["This is my brother.", ["one", "brother"]],
      ["My brother finds a feather.", ["two", "brother", "feather"]],
      ["He shows the feather to Mother.", ["two", "mother", "feather"]],
      ["Then he shows it to Father.", ["two", "father", "feather"]],
      ["They all like the feather together.", ["two", "mother", "father"]]]],
    ["s", "s", "The S sound", "sun", "Sam and the Sea", [
      ["Sam goes to the sea.", ["at", "boy", "sea"]],
      ["Sam sits in the sun on the sand.", ["at", "boy", "beach", "shine"]],
      ["Sam sees a seashell.", ["two", "boy", "seashell"]],
      ["A seagull sees it too!", ["two", "seashell", "dovebird"]],
      ["Sam saves the seashell in his sack.", ["in", "seashell", "sack"]]]],
    ["z", "z", "The Z sound", "zebra", "Zara the Zebra", [
      ["Zara is a zebra at the zoo.", ["at", "zebra", "garden"]],
      ["Zara’s nose is cold.", ["one", "zebra", "cold"]],
      ["The bees bring Zara a rose.", ["two", "bee", "rose"]],
      ["Zara sneezes at the rose!", ["one", "zebra", "happy"]],
      ["Zara dozes in the sun.", ["at", "zebra", "garden", "sleep"]]]],
    ["sh", "sh", "The SH sound", "shoe", "Shelly and the Shark", [
      ["Shelly sails on a ship.", ["at", "ship", "sea"]],
      ["She sees a shark!", ["two", "ship", "shark", "sea"]],
      ["The shark wants a fish.", ["two", "shark", "fish", "sea"]],
      ["Shelly shares her fish with the shark.", ["act", "kidgirl", "hold", "fish"]],
      ["The shark shows Shelly a shell.", ["two", "shark", "seashell", "sea"]]]],
    ["zh", "zh", "The ZH sound (treasure)", "treasure", "The Treasure in the Garage", [
      ["Jack looks in the garage.", ["at", "boy", "garage"]],
      ["He sees an old treasure map.", ["one", "mapword"]],
      ["The map shows a treasure box.", ["one", "treasure"]],
      ["Jack finds the treasure!", ["act", "boy", "hold", "treasure"]],
      ["It is a new television!", ["one", "tv", "shine"]]]],
    ["ch", "ch", "The CH sound", "cheese", "Chip the Chick", [
      ["Chip is a little chick.", ["small", "chick"]],
      ["Chip chases a cheetah!", ["two", "chick", "cheetah"]],
      ["The cheetah runs to the beach.", ["at", "cheetah", "beach", "run"]],
      ["Chip finds a peach on the beach.", ["two", "chick", "peach", "beach"]],
      ["Chip and the cheetah eat the peach.", ["two", "chick", "cheetah"]]]],
    ["j", "j", "The J sound", "juice", "Jen and the Giraffe", [
      ["Jen goes to see a giraffe.", ["two", "kidgirl", "giraffe"]],
      ["The giraffe is just huge!", ["big", "giraffe"]],
      ["Jen gives the giraffe orange juice.", ["act", "kidgirl", "hold", "juice"]],
      ["The giraffe jumps with joy.", ["one", "giraffe", "happy"]],
      ["Jen puts on her pajamas and dreams of the giraffe.", ["at", "pajamas", "night"]]]],
    ["h", "h", "The H sound", "hat", "Henry the Hedgehog", [
      ["Henry is a hedgehog.", ["one", "hedgehog"]],
      ["Henry has a hat.", ["two", "hedgehog", "hat"]],
      ["Henry hops to a horse.", ["two", "hedgehog", "horse"]],
      ["The horse has honey for Henry.", ["two", "horse", "honey"]],
      ["Henry gives the horse a hug.", ["one", "hug", "happy"]]]],
    ["w", "w", "The W sound", "whale", "Wally the Whale", [
      ["Wally is a whale.", ["in", "whale", "sea"]],
      ["Wally wants a watermelon.", ["two", "whale", "watermelon"]],
      ["A wolf walks by with a watermelon.", ["act", "wolf", "hold", "watermelon"]],
      ["The wolf gives Wally the watermelon.", ["two", "wolf", "whale"]],
      ["Wally waves with his tail. We love Wally!", ["in", "whale", "sea"]]]],
    ["y", "y", "The Y sound", "yacht", "Yasmin’s Yacht", [
      ["Yasmin has a yellow yacht.", ["in", "yacht", "sea"]],
      ["Yasmin eats yogurt on her yacht.", ["act", "kidgirl", "eat", "yogurt"]],
      ["A yo-yo falls in the water.", ["in", "yoyo", "sea"]],
      ["Yasmin gets the yo-yo. Yay!", ["act", "kidgirl", "hold", "yoyo"]],
      ["Yasmin yawns and goes to sleep.", ["one", "kidgirl", "sleep"]]]],
    ["l", "l", "The L sound", "lion", "Leo the Lion", [
      ["Leo is a little lion.", ["small", "lion"]],
      ["Leo likes lemons.", ["two", "lion", "lemon"]],
      ["Leo looks for a lemon.", ["at", "lion", "garden"]],
      ["A lamb leads Leo to a lemon tree.", ["two", "lamb", "lion"]],
      ["Leo and the lamb laugh a lot.", ["two", "lion", "lamb", "garden"]]]],
    ["r", "r", "The R sound", "rabbit", "Ruby the Rabbit", [
      ["Ruby is a rabbit.", ["one", "rabbit"]],
      ["Ruby runs to the river.", ["at", "rabbit", "river", "run"]],
      ["It rains on Ruby.", ["at", "rabbit", "rainfall"]],
      ["A parrot gives Ruby a red rose.", ["two", "parrot", "rose"]],
      ["Ruby rests under a rainbow.", ["at", "rabbit", "sky", "sleep"]]]],
    ["sblends", "sp", "S blends (sp, st, sn, sl…)", "spoon", "Stan the Snail", [
      ["Stan is a small snail.", ["small", "snail"]],
      ["Stan sees a star in the sky.", ["at", "snail", "night"]],
      ["A spider spins a web for Stan.", ["two", "spider", "web"]],
      ["Stan slides on a sled in the snow.", ["act", "snail", "ride", "sled"]],
      ["Stan sleeps on a soft sponge.", ["one", "snail", "sleep"]]]],
    ["lblends", "pl", "L blends (pl, fl, cl, gl, bl)", "plane", "Flo’s Plane", [
      ["Flo has a blue plane.", ["act", "kidgirl", "hold", "plane"]],
      ["The plane flies over the flowers.", ["sky", "plane"]],
      ["A fly lands on the plane.", ["two", "fly", "plane"]],
      ["Flo plays with her blocks.", ["act", "kidgirl", "play", "blocks"]],
      ["Flo sleeps under a blanket.", ["one", "blanket"]]]],
    ["rblends", "tr", "R blends (tr, br, dr, fr, gr)", "bigtree", "The Frog and the Train", [
      ["A green frog lives in a tree.", ["on", "frog", "bigtree"]],
      ["The frog hears a train.", ["two", "frog", "train"]],
      ["The frog drives a truck to the train.", ["act", "frog", "ride", "truck"]],
      ["The frog crosses the bridge.", ["two", "frog", "bridge"]],
      ["The frog eats bread and grapes. Great trip!", ["and", "loafbread", "grapes"]]]],
  ];
  const sounds = STORIES.map(([id, letter, name, art, story, pages], s) => {
    const phrases = pages.map(([text, picture], i) => ({ n: s * 5 + i + 1, id: `${id}-${i + 1}`, text, picture, sound: id }));
    /* The plan reads words[level] to count a whole session: five graded pages; a retelling counts whenever sounds were counted. */
    return { id, letter, name, art, story, phrases, words: { pages: phrases, retell: phrases.slice(0, 1) } };
  });
  return { title: 'Stories', positions, sounds, soundById: id => sounds.find(entry => entry.id === id), positionName: id => positions.find(entry => entry.id === id)?.name || id };
})();
