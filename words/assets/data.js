/* The English (General American) sounds and their words. Each word: [recording number, word, drawing key].
   A word in two sounds shares its recording. Not every sound has all three places in the word: English has no
   word starting with NG, and /ʒ/, /ð/, /h/, /w/, /y/ and the blends are practised only where they occur. */
window.ArticulationData = (() => {
  const positions = [
    { id: 'first', name: 'Beginning of the word' },
    { id: 'middle', name: 'Middle of the word' },
    { id: 'last', name: 'End of the word' },
  ];
  const sound = (id, letter, name, ipa, art, scenario, lists) => ({
    id, letter, name, ipa, art, scenario,
    zones: positions.map(entry => entry.id).filter(zone => lists[zone]),
    words: Object.fromEntries(positions.map(({ id: zone }) => [zone, (lists[zone] || []).map(([n, word, drawing]) => ({ n, word, art: drawing, zone, sound: id }))])),
  });
  const sounds = [
    sound('p', 'p', 'The P sound', 'p', 'pig', 'islands', {
      first: [[1, 'pig', 'pig'], [2, 'pear', 'pear'], [3, 'pencil', 'pencil'], [4, 'penguin', 'penguin'], [5, 'pineapple', 'pineapple'], [6, 'pie', 'pie'], [7, 'peach', 'peach'], [8, 'pool', 'pool'], [9, 'pumpkin', 'pumpkin'], [10, 'pot', 'pot']],
      middle: [[11, 'apple', 'apple'], [12, 'paper', 'paper'], [13, 'octopus', 'octopus'], [14, 'caterpillar', 'caterpillar'], [15, 'laptop', 'laptop'], [16, 'newspaper', 'newspaper'], [17, 'carpet', 'carpet'], [18, 'puppy', 'puppy']],
      last: [[19, 'cup', 'coffeecup'], [20, 'map', 'mapword'], [21, 'rope', 'rope'], [22, 'ship', 'ship'], [23, 'soap', 'soap'], [24, 'trap', 'trap'], [25, 'clip', 'clip'], [26, 'lamp', 'floorlamp'], [27, 'stamp', 'stamp'], [28, 'pump', 'pump']],
    }),
    sound('b', 'b', 'The B sound', 'b', 'ball', 'house', {
      first: [[29, 'ball', 'ball'], [30, 'banana', 'banana'], [31, 'bear', 'bear'], [32, 'bed', 'bed'], [33, 'bee', 'bee'], [34, 'bell', 'bell'], [35, 'boat', 'boatword'], [36, 'book', 'book'], [37, 'box', 'emptybox'], [38, 'baby', 'baby']],
      middle: [[39, 'rabbit', 'rabbit'], [40, 'table', 'table'], [41, 'ribbon', 'ribbon'], [42, 'umbrella', 'umbrella'], [43, 'cucumber', 'cucumber'], [44, 'mailbox', 'mailbox'], [45, 'notebook', 'notebook'], [46, 'rowboat', 'rowboat']],
      last: [[47, 'bulb', 'bulb'], [49, 'crab', 'crab'], [50, 'web', 'web'], [51, 'tub', 'bathtub'], [52, 'cub', 'cub']],
    }),
    sound('t', 't', 'The T sound', 't', 'tiger', 'street', {
      first: [[40, 'table', 'table'], [53, 'tail', 'tail'], [54, 'teeth', 'teeth'], [55, 'ten', 'ten'], [56, 'tiger', 'tiger'], [57, 'tomato', 'tomato'], [58, 'tongue', 'tongue'], [59, 'toy', 'toy'], [60, 'turtle', 'turtle'], [61, 'two', 'two']],
      middle: [[62, 'butter', 'butter'], [63, 'button', 'button'], [64, 'water', 'water'], [65, 'letter', 'letter'], [66, 'cactus', 'cactusword'], [67, 'doctor', 'doctor'], [68, 'bottle', 'bottle'], [69, 'lettuce', 'lettuce'], [13, 'octopus', 'octopus']],
      last: [[70, 'cat', 'cat'], [71, 'hat', 'hat'], [72, 'bat', 'bat'], [73, 'coat', 'coat'], [74, 'foot', 'foot'], [75, 'goat', 'goat'], [76, 'rat', 'rat'], [77, 'plate', 'plate'], [78, 'net', 'net'], [79, 'heart', 'heart']],
    }),
    sound('d', 'd', 'The D sound', 'd', 'dog', 'islands', {
      first: [[80, 'dog', 'dog'], [81, 'doll', 'doll'], [82, 'duck', 'duck'], [83, 'desk', 'desk'], [84, 'dolphin', 'dolphin'], [85, 'donkey', 'donkey'], [86, 'dish', 'dish'], [87, 'diver', 'diver'], [67, 'doctor', 'doctor'], [88, 'dove', 'dovebird']],
      middle: [[89, 'ladder', 'ladder'], [90, 'spider', 'spider'], [91, 'radio', 'radio'], [92, 'needle', 'needle'], [93, 'garden', 'garden'], [94, 'candle', 'candle'], [95, 'window', 'window'], [96, 'shadow', 'shadow']],
      last: [[32, 'bed', 'bed'], [97, 'bread', 'loafbread'], [98, 'hand', 'hand'], [99, 'head', 'head'], [100, 'lid', 'lid'], [101, 'road', 'road'], [102, 'sled', 'sled'], [103, 'sword', 'sword'], [104, 'cloud', 'cloudword'], [105, 'sand', 'sandpile']],
    }),
    sound('k', 'k', 'The K sound', 'k', 'cake', 'house', {
      first: [[106, 'cake', 'cake'], [107, 'car', 'car'], [70, 'cat', 'cat'], [108, 'cow', 'cow'], [19, 'cup', 'coffeecup'], [109, 'key', 'key'], [110, 'king', 'king'], [111, 'camel', 'camel'], [94, 'candle', 'candle'], [112, 'comb', 'comb']],
      middle: [[113, 'monkey', 'monkey'], [114, 'chicken', 'chicken'], [85, 'donkey', 'donkey'], [115, 'rocket', 'rocket'], [116, 'racket', 'racket'], [117, 'peacock', 'peacock'], [118, 'bicycle', 'bicycle'], [43, 'cucumber', 'cucumber']],
      last: [[36, 'book', 'book'], [119, 'clock', 'clock'], [82, 'duck', 'duck'], [120, 'fork', 'fork'], [121, 'lake', 'lake'], [122, 'milk', 'milk'], [123, 'neck', 'neck'], [124, 'truck', 'truck'], [125, 'snake', 'snake'], [126, 'sack', 'sack']],
    }),
    sound('g', 'g', 'The G sound', 'g', 'goat', 'street', {
      first: [[75, 'goat', 'goat'], [127, 'girl', 'kidgirl'], [128, 'gift', 'gift'], [93, 'garden', 'garden'], [129, 'goose', 'goose'], [130, 'gold', 'gold']],
      middle: [[56, 'tiger', 'tiger'], [131, 'dragon', 'dragon'], [132, 'eagle', 'eagle'], [133, 'finger', 'finger'], [134, 'magnet', 'magnet'], [4, 'penguin', 'penguin'], [135, 'yogurt', 'yogurt']],
      last: [[80, 'dog', 'dog'], [136, 'egg', 'egg'], [137, 'flag', 'flag'], [138, 'frog', 'frog'], [139, 'leg', 'leg'], [1, 'pig', 'pig'], [140, 'hug', 'hug'], [141, 'peg', 'peg']],
    }),
    sound('m', 'm', 'The M sound', 'm', 'moon', 'islands', {
      first: [[142, 'man', 'man'], [20, 'map', 'mapword'], [143, 'moon', 'moon'], [144, 'mouse', 'mouse'], [145, 'mouth', 'mouth'], [122, 'milk', 'milk'], [113, 'monkey', 'monkey'], [146, 'mask', 'mask'], [147, 'money', 'money'], [148, 'mushroom', 'mushroom']],
      middle: [[111, 'camel', 'camel'], [149, 'hammer', 'hammer'], [150, 'lemon', 'lemon'], [57, 'tomato', 'tomato'], [9, 'pumpkin', 'pumpkin'], [151, 'tummy', 'tummy']],
      last: [[152, 'arm', 'arm'], [153, 'broom', 'broom'], [112, 'comb', 'comb'], [154, 'drum', 'drum'], [155, 'lamb', 'lamb'], [156, 'room', 'roomword'], [157, 'ram', 'ram'], [158, 'palm', 'palmtree']],
    }),
    sound('n', 'n', 'The N sound', 'n', 'nose', 'house', {
      first: [[159, 'nail', 'nail'], [123, 'neck', 'neck'], [92, 'needle', 'needle'], [160, 'nest', 'nest'], [78, 'net', 'net'], [161, 'nose', 'nose'], [162, 'knee', 'knee'], [163, 'knife', 'knife'], [164, 'knight', 'knight'], [165, 'nurse', 'nurse']],
      middle: [[30, 'banana', 'banana'], [166, 'onion', 'onion'], [147, 'money', 'money'], [167, 'honey', 'honey'], [3, 'pencil', 'pencil'], [168, 'tunnel', 'tunnel'], [5, 'pineapple', 'pineapple']],
      last: [[169, 'sun', 'sun'], [143, 'moon', 'moon'], [170, 'train', 'train'], [171, 'phone', 'phone'], [172, 'lion', 'lion'], [173, 'chin', 'chin'], [174, 'spoon', 'spoon'], [63, 'button', 'button'], [175, 'corn', 'corn'], [176, 'crown', 'crown']],
    }),
    sound('ng', 'ng', 'The NG sound', 'ŋ', 'king', 'street', {
      middle: [[133, 'finger', 'finger'], [113, 'monkey', 'monkey'], [177, 'blanket', 'blanket'], [178, 'triangle', 'triangle'], [4, 'penguin', 'penguin'], [85, 'donkey', 'donkey']],
      last: [[110, 'king', 'king'], [179, 'ring', 'ring'], [180, 'wing', 'wing'], [58, 'tongue', 'tongue'], [181, 'swing', 'swingword'], [182, 'painting', 'painting']],
    }),
    sound('f', 'f', 'The F sound', 'f', 'fish', 'islands', {
      first: [[183, 'fan', 'fan'], [184, 'fish', 'fish'], [185, 'feather', 'feather'], [186, 'fence', 'fenceword'], [120, 'fork', 'fork'], [187, 'fox', 'fox'], [188, 'face', 'faceword'], [133, 'finger', 'finger'], [74, 'foot', 'foot'], [171, 'phone', 'phone']],
      middle: [[189, 'coffee', 'coffee'], [190, 'elephant', 'elephant'], [84, 'dolphin', 'dolphin'], [191, 'butterfly', 'butterflyword'], [192, 'telephone', 'phone'], [193, 'sofa', 'sofa']],
      last: [[163, 'knife', 'knife'], [194, 'leaf', 'leafword'], [195, 'giraffe', 'giraffe'], [196, 'chef', 'chef'], [197, 'scarf', 'scarf'], [198, 'shelf', 'shelf'], [199, 'wolf', 'wolf']],
    }),
    sound('v', 'v', 'The V sound', 'v', 'van', 'house', {
      first: [[201, 'van', 'van'], [202, 'vase', 'vase'], [203, 'vest', 'vest'], [204, 'violin', 'violin'], [205, 'vegetables', 'vegetables'], [206, 'volcano', 'volcano']],
      middle: [[207, 'river', 'river'], [208, 'oven', 'oven'], [87, 'diver', 'diver'], [209, 'envelope', 'envelope'], [210, 'elevator', 'elevator'], [211, 'clover', 'clover'], [212, 'tv', 'tv']],
      last: [[213, 'cave', 'cave'], [88, 'dove', 'dovebird'], [214, 'olive', 'olive'], [215, 'glove', 'gloves'], [216, 'five', 'five'], [217, 'stove', 'stove']],
    }),
    sound('th', 'th', 'The TH sound (thumb)', 'θ', 'thumb', 'street', {
      first: [[218, 'thumb', 'thumb'], [219, 'thief', 'thief'], [220, 'thorn', 'thorns'], [221, 'thigh', 'thigh'], [222, 'thirsty', 'thirsty'], [223, 'thermometer', 'thermometer']],
      middle: [[224, 'toothpaste', 'toothpaste'], [225, 'toothbrush', 'toothbrush'], [226, 'bathtub', 'bathtub'], [227, 'birthday', 'birthday']],
      last: [[54, 'teeth', 'teeth'], [145, 'mouth', 'mouth'], [228, 'moth', 'moth'], [229, 'earth', 'earth'], [230, 'bath', 'bathtub']],
    }),
    sound('dh', 'th', 'The TH sound (feather)', 'ð', 'feather', 'islands', {
      middle: [[185, 'feather', 'feather'], [231, 'weather', 'weather'], [232, 'mother', 'mother'], [233, 'father', 'father'], [234, 'brother', 'brother']],
    }),
    sound('s', 's', 'The S sound', 's', 'sun', 'house', {
      first: [[169, 'sun', 'sun'], [23, 'soap', 'soap'], [235, 'sea', 'sea'], [236, 'saw', 'saw'], [237, 'sail', 'sail'], [105, 'sand', 'sandpile'], [238, 'six', 'six'], [239, 'sink', 'sink'], [240, 'socks', 'socks'], [241, 'seat', 'seat']],
      middle: [[3, 'pencil', 'pencil'], [118, 'bicycle', 'bicycle'], [242, 'glasses', 'glasses'], [243, 'whistle', 'whistle'], [244, 'medicine', 'medicine'], [245, 'muscle', 'muscle']],
      last: [[246, 'house', 'house'], [144, 'mouse', 'mouse'], [247, 'horse', 'horse'], [248, 'rice', 'rice'], [249, 'juice', 'juice'], [250, 'dress', 'dress'], [188, 'face', 'faceword'], [129, 'goose', 'goose'], [186, 'fence', 'fenceword'], [69, 'lettuce', 'lettuce']],
    }),
    sound('z', 'z', 'The Z sound', 'z', 'zebra', 'street', {
      first: [[251, 'zebra', 'zebra'], [252, 'zipper', 'zipper'], [253, 'zero', 'zero'], [254, 'xylophone', 'xylophone']],
      middle: [[255, 'scissors', 'scissors'], [256, 'puzzle', 'puzzle'], [257, 'raisins', 'raisins'], [258, 'tweezers', 'tweezers'], [259, 'desert', 'desert'], [16, 'newspaper', 'newspaper']],
      last: [[161, 'nose', 'nose'], [260, 'rose', 'rose'], [261, 'cheese', 'cheese'], [262, 'eggs', 'eggs'], [263, 'gloves', 'gloves'], [264, 'cherries', 'cherries'], [265, 'stairs', 'stairs'], [266, 'waves', 'waves']],
    }),
    sound('sh', 'sh', 'The SH sound', 'ʃ', 'shoe', 'islands', {
      first: [[267, 'shoe', 'shoe'], [22, 'ship', 'ship'], [268, 'shark', 'shark'], [269, 'shirt', 'shirt'], [198, 'shelf', 'shelf'], [270, 'shell', 'seashell'], [271, 'sugar', 'sugar'], [272, 'shoulder', 'shoulder'], [196, 'chef', 'chef'], [96, 'shadow', 'shadow']],
      middle: [[273, 'cushion', 'cushion'], [148, 'mushroom', 'mushroom'], [274, 'ocean', 'ocean'], [275, 'washer', 'washer'], [276, 'flashlight', 'flashlight'], [277, 'seashell', 'seashell']],
      last: [[184, 'fish', 'fish'], [86, 'dish', 'dish'], [278, 'radish', 'radish'], [279, 'crash', 'crash'], [225, 'toothbrush', 'toothbrush']],
    }),
    sound('zh', 'zh', 'The ZH sound (treasure)', 'ʒ', 'treasure', 'house', {
      middle: [[280, 'treasure', 'treasure'], [281, 'television', 'tv']],
      last: [[282, 'garage', 'garage']],
    }),
    sound('ch', 'ch', 'The CH sound', 'tʃ', 'cheese', 'street', {
      first: [[261, 'cheese', 'cheese'], [264, 'cherries', 'cherries'], [283, 'chick', 'chick'], [114, 'chicken', 'chicken'], [173, 'chin', 'chin'], [284, 'cheetah', 'cheetah'], [285, 'chest', 'chestbody'], [286, 'child', 'boy']],
      middle: [[287, 'kitchen', 'kitchen'], [288, 'teacher', 'teacher'], [289, 'armchair', 'armchair'], [290, 'statue', 'statue']],
      last: [[291, 'beach', 'beach'], [7, 'peach', 'peach'], [292, 'branch', 'branch'], [293, 'ostrich', 'ostrich'], [294, 'watch', 'watch']],
    }),
    sound('j', 'j', 'The J sound', 'dʒ', 'juice', 'islands', {
      first: [[195, 'giraffe', 'giraffe'], [249, 'juice', 'juice'], [295, 'judge', 'judge'], [296, 'jar', 'jar'], [297, 'jacket', 'jacket'], [298, 'jellyfish', 'jellyfish']],
      middle: [[299, 'hedgehog', 'hedgehog'], [205, 'vegetables', 'vegetables'], [300, 'pajamas', 'pajamas']],
      last: [[301, 'bridge', 'bridge'], [302, 'cage', 'cage'], [303, 'fridge', 'icebox'], [295, 'judge', 'judge'], [304, 'bandage', 'bandage'], [305, 'orange', 'citrus']],
    }),
    sound('h', 'h', 'The H sound', 'h', 'hat', 'house', {
      first: [[71, 'hat', 'hat'], [98, 'hand', 'hand'], [99, 'head', 'head'], [79, 'heart', 'heart'], [247, 'horse', 'horse'], [246, 'house', 'house'], [149, 'hammer', 'hammer'], [306, 'hair', 'hairword'], [167, 'honey', 'honey'], [299, 'hedgehog', 'hedgehog']],
    }),
    sound('w', 'w', 'The W sound', 'w', 'whale', 'street', {
      first: [[307, 'wall', 'wall'], [64, 'water', 'water'], [308, 'watermelon', 'watermelon'], [309, 'wheel', 'wheel'], [310, 'whale', 'whale'], [95, 'window', 'window'], [180, 'wing', 'wing'], [199, 'wolf', 'wolf'], [311, 'well', 'well'], [50, 'web', 'web']],
    }),
    sound('y', 'y', 'The Y sound', 'j', 'yacht', 'islands', {
      first: [[312, 'yacht', 'yacht'], [135, 'yogurt', 'yogurt'], [313, 'yo-yo', 'yoyo'], [314, 'yarn', 'yarn']],
      middle: [[166, 'onion', 'onion'], [313, 'yo-yo', 'yoyo'], [315, 'crayon', 'crayon']],
    }),
    sound('l', 'l', 'The L sound', 'l', 'lion', 'house', {
      first: [[26, 'lamp', 'floorlamp'], [194, 'leaf', 'leafword'], [139, 'leg', 'leg'], [150, 'lemon', 'lemon'], [172, 'lion', 'lion'], [316, 'lips', 'lips'], [155, 'lamb', 'lamb'], [89, 'ladder', 'ladder'], [121, 'lake', 'lake'], [65, 'letter', 'letter']],
      middle: [[317, 'balloon', 'toyballoon'], [318, 'pillow', 'pillow'], [319, 'belly', 'belly'], [190, 'elephant', 'elephant'], [42, 'umbrella', 'umbrella'], [214, 'olive', 'olive'], [320, 'wallet', 'wallet'], [321, 'ruler', 'ruler']],
      last: [[29, 'ball', 'ball'], [34, 'bell', 'bell'], [81, 'doll', 'doll'], [322, 'owl', 'owl'], [309, 'wheel', 'wheel'], [323, 'snail', 'snail'], [324, 'bowl', 'bowl'], [8, 'pool', 'pool'], [53, 'tail', 'tail'], [159, 'nail', 'nail']],
    }),
    sound('r', 'r', 'The R sound', 'r', 'rabbit', 'street', {
      first: [[39, 'rabbit', 'rabbit'], [325, 'rain', 'rain'], [179, 'ring', 'ring'], [21, 'rope', 'rope'], [260, 'rose', 'rose'], [115, 'rocket', 'rocket'], [321, 'ruler', 'ruler'], [91, 'radio', 'radio'], [76, 'rat', 'rat'], [101, 'road', 'road']],
      middle: [[326, 'carrots', 'carrots'], [327, 'parrot', 'parrot'], [328, 'arrow', 'arrowsign'], [264, 'cherries', 'cherries'], [195, 'giraffe', 'giraffe'], [329, 'pyramid', 'pyramid']],
      last: [[107, 'car', 'car'], [31, 'bear', 'bear'], [330, 'ear', 'ear'], [2, 'pear', 'pear'], [306, 'hair', 'hairword'], [331, 'star', 'starword']],
    }),
    sound('sblends', 'sp', 'S blends (sp, st, sn, sl…)', 's+', 'spoon', 'islands', {
      first: [[174, 'spoon', 'spoon'], [90, 'spider', 'spider'], [331, 'star', 'starword'], [125, 'snake', 'snake'], [323, 'snail', 'snail'], [102, 'sled', 'sled'], [332, 'skirt', 'skirt'], [333, 'sky', 'sky'], [334, 'skunk', 'skunk'], [27, 'stamp', 'stamp']],
    }),
    sound('lblends', 'pl', 'L blends (pl, fl, cl, gl, bl)', 'C+l', 'plane', 'house', {
      first: [[335, 'plane', 'plane'], [77, 'plate', 'plate'], [137, 'flag', 'flag'], [336, 'flower', 'flowerword'], [337, 'fly', 'fly'], [119, 'clock', 'clock'], [104, 'cloud', 'cloudword'], [242, 'glasses', 'glasses'], [263, 'gloves', 'gloves'], [338, 'blocks', 'blocks']],
    }),
    sound('rblends', 'tr', 'R blends (tr, br, dr, fr, gr)', 'C+r', 'bigtree', 'street', {
      first: [[339, 'tree', 'bigtree'], [170, 'train', 'train'], [124, 'truck', 'truck'], [97, 'bread', 'loafbread'], [301, 'bridge', 'bridge'], [153, 'broom', 'broom'], [154, 'drum', 'drum'], [250, 'dress', 'dress'], [138, 'frog', 'frog'], [340, 'grapes', 'grapes']],
    }),
  ];
  const positionsOf = sound => positions.filter(entry => (typeof sound === 'string' ? sounds.find(s => s.id === sound) : sound).zones.includes(entry.id));
  return { positions, positionsOf, sounds, soundById: id => sounds.find(entry => entry.id === id), positionName: id => positions.find(entry => entry.id === id).name };
})();
