import { Question } from '../types';

export const INITIAL_QUIZ_DATA: Question[] = [
  // --- Bộ câu hỏi mẫu chuẩn theo yêu cầu ban đầu ---
  {
    id: 'vn-q1',
    question: 'Chiến thắng lịch sử Điện Biên Phủ diễn ra vào năm nào?',
    options: ['Năm 1945', 'Năm 1954', 'Năm 1968', 'Năm 1975'],
    correct: 1,
    explanation: 'Chiến thắng Điện Biên Phủ diễn ra vào ngày 7/5/1954, chấm dứt 9 năm kháng chiến chống Pháp của nhân dân Việt Nam.',
    category: 'Kháng chiến chống Pháp',
    difficulty: 'Dễ',
    period: '1945 - 1954'
  },
  {
    id: 'vn-q2',
    question: 'Ai là tác giả của bản "Tuyên ngôn Độc lập" đọc tại Quảng trường Ba Đình ngày 2/9/1945?',
    options: ['Võ Nguyên Giáp', 'Phạm Văn Đồng', 'Hồ Chí Minh', 'Tôn Đức Thắng'],
    correct: 2,
    explanation: 'Chủ tịch Hồ Chí Minh là người soạn thảo và đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa.',
    category: 'Cách mạng tháng Tám 1945',
    difficulty: 'Dễ',
    period: '1945'
  },
  {
    id: 'vn-q3',
    question: 'Cách mạng tháng Tám năm 1945 ở Việt Nam mang tính chất gì?',
    options: ['Cách mạng tư sản', 'Cách mạng giải phóng dân tộc', 'Cách mạng xã hội chủ nghĩa', 'Cách mạng dân chủ tư sản kiểu mới'],
    correct: 1,
    explanation: 'Cách mạng tháng Tám là cuộc cách mạng giải phóng dân tộc, đánh đuổi ách thống trị của phát xít Nhật và thực dân Pháp.',
    category: 'Cách mạng tháng Tám 1945',
    difficulty: 'Trung bình',
    period: '1945'
  },
  {
    id: 'w-q4',
    question: 'Trận chiến nào được coi là bước ngoặt của Chiến tranh thế giới thứ hai ở châu Âu?',
    options: ['Trận Stalingrad', 'Trận Normandy', 'Trận Kursk', 'Trận Midway'],
    correct: 0,
    explanation: 'Trận Stalingrad (1942–1943) giữa Hồng quân Liên Xô và Đức Quốc xã được coi là bước ngoặt lớn nhất làm xoay chuyển cục diện Chiến tranh thế giới thứ hai.',
    category: 'Lịch sử Thế giới',
    difficulty: 'Trung bình',
    period: '1939 - 1945'
  },
  {
    id: 'w-q5',
    question: 'Tổ chức Liên Hợp Quốc (UN) chính thức được thành lập vào năm nào?',
    options: ['Năm 1919', 'Năm 1939', 'Năm 1945', 'Năm 1950'],
    correct: 2,
    explanation: 'Liên Hợp Quốc chính thức thành lập vào ngày 24/10/1945 sau khi Hiến chương Liên Hợp Quốc được đại diện các nước phê chuẩn.',
    category: 'Lịch sử Thế giới',
    difficulty: 'Dễ',
    period: '1945'
  },

  // --- Kháng chiến chống Mỹ (1954 - 1975) ---
  {
    id: 'vn-q6',
    question: 'Chiến dịch Hồ Chí Minh lịch sử giải phóng hoàn toàn miền Nam, thống nhất đất nước kết thúc vào ngày nào?',
    options: ['30 tháng 4 năm 1975', '26 tháng 3 năm 1975', '1 tháng 5 năm 1975', '19 tháng 5 năm 1975'],
    correct: 0,
    explanation: 'Vào lúc 11 giờ 30 phút ngày 30/4/1975, lá cờ cách mạng tung bay trên nóc Dinh Độc Lập, đánh dấu Chiến dịch Hồ Chí Minh toàn thắng.',
    category: 'Kháng chiến chống Mỹ',
    difficulty: 'Dễ',
    period: '1954 - 1975'
  },
  {
    id: 'vn-q7',
    question: 'Trận "Điện Biên Phủ trên không" diễn ra trong 12 ngày đêm khốc liệt vào thời gian nào?',
    options: ['Tháng 12 năm 1970', 'Tháng 12 năm 1972', 'Tháng 1 năm 1973', 'Tháng 3 năm 1975'],
    correct: 1,
    explanation: 'Từ ngày 18 đến 29/12/1972, quân và dân miền Bắc đã đập tan cuộc tập kích chiến lược bằng máy bay B-52 của đế quốc Mỹ vào Hà Nội, Hải Phòng.',
    category: 'Kháng chiến chống Mỹ',
    difficulty: 'Trung bình',
    period: '1954 - 1975'
  },
  {
    id: 'vn-q8',
    question: 'Hiệp định Pa-ri về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký kết vào năm nào?',
    options: ['Năm 1954', 'Năm 1972', 'Năm 1973', 'Năm 1975'],
    correct: 2,
    explanation: 'Hiệp định Pa-ri được ký kết chính thức ngày 27/1/1973 tại Paris (Pháp), buộc Mỹ phải rút hết quân đội về nước.',
    category: 'Kháng chiến chống Mỹ',
    difficulty: 'Trung bình',
    period: '1973'
  },
  {
    id: 'vn-q9',
    question: 'Phong trào "Đồng Khởi" (1959–1960) nổ ra tiêu biểu nhất tại địa phương nào?',
    options: ['Bến Tre', 'Quảng Nam', 'Bình Định', 'Tây Ninh'],
    correct: 0,
    explanation: 'Phong trào Đồng Khởi bắt đầu bùng nổ từ huyện Mỏ Cày (Bến Tre) vào ngày 17/1/1960, sau đó lan rộng khắp Nam Bộ và Tây Nguyên.',
    category: 'Kháng chiến chống Mỹ',
    difficulty: 'Dễ',
    period: '1954 - 1975'
  },

  // --- Lịch sử Việt Nam Cổ - Trung đại ---
  {
    id: 'vn-q10',
    question: 'Chiến thắng Bạch Đằng lịch sử năm 938 do ai lãnh đạo, chấm dứt hơn 1000 năm Bắc thuộc?',
    options: ['Đinh Bộ Lĩnh', 'Ngô Quyền', 'Lê Hoàn', 'Lý Thường Kiệt'],
    correct: 1,
    explanation: 'Năm 938, Ngô Quyền đã lãnh đạo nhân dân đánh bại quân Nam Hán trên sông Bạch Đằng bằng chiến thuật cọc ngầm, mở ra kỷ nguyên độc lập tự chủ lâu dài.',
    category: 'Việt Nam Cổ - Trung đại',
    difficulty: 'Dễ',
    period: 'Thời Bắc thuộc & Tự chủ'
  },
  {
    id: 'vn-q11',
    question: 'Bài thơ "Nam quốc sơn hà" được ví như bản tuyên ngôn độc lập đầu tiên của nước ta gắn liền với sự kiện nào?',
    options: ['Kháng chiến chống quân Tống năm 1077', 'Khởi nghĩa Hai Bà Trưng năm 40', 'Chiến thắng Bạch Đằng năm 1288', 'Khởi nghĩa Lam Sơn năm 1427'],
    correct: 0,
    explanation: 'Bài thơ thần "Nam quốc sơn hà" vang lên trên phòng tuyến sông Như Nguyệt năm 1077 trong cuộc kháng chiến chống quân Tống do danh tướng Lý Thường Kiệt chỉ huy.',
    category: 'Việt Nam Cổ - Trung đại',
    difficulty: 'Trung bình',
    period: 'Thời Lý'
  },
  {
    id: 'vn-q12',
    question: 'Ai là tác giả của áng thiên cổ hùng văn "Bình Ngô đại cáo" công bố vào năm 1428?',
    options: ['Lê Lợi', 'Nguyễn Trãi', 'Trần Hưng Đạo', 'Chu Văn An'],
    correct: 1,
    explanation: 'Nguyễn Trãi thừa lệnh Lê Lợi viết "Bình Ngô đại cáo" vào mùa xuân năm 1428 để tổng kết cuộc khởi nghĩa Lam Sơn toàn thắng chống quân Minh.',
    category: 'Việt Nam Cổ - Trung đại',
    difficulty: 'Dễ',
    period: 'Thời Hậu Lê'
  },
  {
    id: 'vn-q13',
    question: 'Hội nghị Diên Hồng - biểu tượng của khối đại đoàn kết toàn dân tộc được tổ chức vào triều đại nào?',
    options: ['Nhà Lý', 'Nhà Trần', 'Nhà Hậu Lê', 'Nhà Nguyễn'],
    correct: 1,
    explanation: 'Hội nghị Diên Hồng do Thượng hoàng Trần Thánh Tông triệu tập năm 1284 tại điện Diên Hồng để lấy ý kiến các bô lão về quyết tâm đánh giặc Mông - Nguyên.',
    category: 'Việt Nam Cổ - Trung đại',
    difficulty: 'Trung bình',
    period: 'Thời Trần'
  },
  {
    id: 'vn-q14',
    question: 'Chiến thắng Ngọc Hồi - Đống Đa đại phá 29 vạn quân Thanh vào mùa xuân năm nào?',
    options: ['Năm 1788', 'Năm 1789', 'Năm 1792', 'Năm 1802'],
    correct: 1,
    explanation: 'Vào mùng 5 Tết Kỷ Dậu (1789), nghĩa quân Tây Sơn do Hoàng đế Quang Trung chỉ huy tiến vào Thăng Long, hoàn thành đại thắng trước quân xâm lược Mãn Thanh.',
    category: 'Việt Nam Cổ - Trung đại',
    difficulty: 'Trung bình',
    period: 'Thời Tây Sơn'
  },

  // --- Cách mạng Việt Nam (1930 - 1945) ---
  {
    id: 'vn-q15',
    question: 'Đảng Cộng sản Việt Nam được thành lập vào ngày tháng năm nào?',
    options: ['3 tháng 2 năm 1930', '19 tháng 5 năm 1930', '2 tháng 9 năm 1945', '22 tháng 12 năm 1944'],
    correct: 0,
    explanation: 'Hội nghị hợp nhất các tổ chức cộng sản diễn ra từ ngày 6/1/1930 tại Cửu Long (Hương Cảng, Trung Quốc) do Nguyễn Ái Quốc chủ trì, lấy ngày 3/2/1930 làm ngày kỷ niệm thành lập Đảng.',
    category: 'Thành lập Đảng & Phong trào',
    difficulty: 'Dễ',
    period: '1930'
  },
  {
    id: 'vn-q16',
    question: 'Đội Việt Nam Tuyên truyền Giải phóng quân (tiền thân của Quân đội nhân dân Việt Nam) được thành lập vào ngày nào?',
    options: ['22 tháng 12 năm 1944', '19 tháng 8 năm 1945', '2 tháng 9 năm 1945', '7 tháng 5 năm 1954'],
    correct: 0,
    explanation: 'Đội Việt Nam Tuyên truyền Giải phóng quân thành lập ngày 22/12/1944 tại khu rừng giữa hai tổng Hoàng Hoa Thám và Trần Hưng Đạo (Cao Bằng), do đồng chí Võ Nguyên Giáp chỉ huy.',
    category: 'Cách mạng tháng Tám 1945',
    difficulty: 'Dễ',
    period: '1944'
  },
  {
    id: 'vn-q17',
    question: 'Bác Hồ ra đi tìm đường cứu nước tại Bến Nhà Rồng (Sài Gòn) vào ngày tháng năm nào?',
    options: ['5 tháng 6 năm 1911', '19 tháng 5 năm 1890', '3 tháng 2 năm 1930', '28 tháng 1 năm 1941'],
    correct: 0,
    explanation: 'Ngày 5/6/1911, người thanh niên yêu nước Nguyễn Tất Thành với tên gọi Văn Ba đã rời bến cảng Nhà Rồng trên con tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước.',
    category: 'Thành lập Đảng & Phong trào',
    difficulty: 'Dễ',
    period: '1911'
  },

  // --- Lịch sử Thế giới ---
  {
    id: 'w-q18',
    question: 'Chiến tranh thế giới thứ nhất diễn ra trong khoảng thời gian nào?',
    options: ['1914 – 1918', '1939 – 1945', '1911 – 1917', '1917 – 1922'],
    correct: 0,
    explanation: 'Chiến tranh thế giới thứ nhất bùng nổ từ tháng 7/1914 và kết thúc vào tháng 11/1918 sau khi phe Liên minh đầu hàng.',
    category: 'Lịch sử Thế giới',
    difficulty: 'Dễ',
    period: '1914 - 1918'
  },
  {
    id: 'w-q19',
    question: 'Cách mạng tháng Mười Nga bùng nổ và thắng lợi vào năm nào?',
    options: ['Năm 1905', 'Năm 1917', 'Năm 1922', 'Năm 1924'],
    correct: 1,
    explanation: 'Tháng 10 năm 1917 theo lịch Nga (tháng 11 dương lịch), cuộc Cách mạng xã hội chủ nghĩa tháng Mười vĩ đại dưới sự lãnh đạo của V.I.Lênin đã thắng lợi.',
    category: 'Lịch sử Thế giới',
    difficulty: 'Dễ',
    period: '1917'
  },
  {
    id: 'w-q20',
    question: 'Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập vào năm nào tại Băng Cốc?',
    options: ['Năm 1965', 'Năm 1967', 'Năm 1975', 'Năm 1995'],
    correct: 1,
    explanation: 'ASEAN được thành lập ngày 8/8/1967 tại Bangkok (Thái Lan) với 5 thành viên sáng lập: Indonesia, Malaysia, Philippines, Singapore và Thái Lan. Việt Nam gia nhập năm 1995.',
    category: 'Lịch sử Thế giới',
    difficulty: 'Trung bình',
    period: '1967'
  },
  {
    id: 'w-q21',
    question: 'Sự kiện nào đánh dấu Chiến tranh thế giới thứ hai bùng nổ ở châu Âu?',
    options: [
      'Phát xít Đức tấn công Ba Lan ngày 1/9/1939',
      'Đức tấn công Liên Xô năm 1941',
      'Nhật Bản tập kích Trân Châu Cảng năm 1941',
      'Ý tấn công Ethiopia năm 1935'
    ],
    correct: 0,
    explanation: 'Ngày 1/9/1939, phát xít Đức bất ngờ nổ súng tấn công Ba Lan, khiến Anh và Pháp tuyên chiến với Đức, đánh dấu Chiến tranh thế giới thứ hai bùng nổ.',
    category: 'Lịch sử Thế giới',
    difficulty: 'Trung bình',
    period: '1939 - 1945'
  },
  {
    id: 'w-q22',
    question: 'Sự kiện "Bức tường Berlin sụp đổ" diễn ra vào năm nào, biểu trưng cho sự kết thúc Chiến tranh Lạnh?',
    options: ['Năm 1985', 'Năm 1989', 'Năm 1991', 'Năm 1993'],
    correct: 1,
    explanation: 'Ngày 9/11/1989, bức tường Berlin ngăn cách Đông và Tây Berlin chính thức sụp đổ, mở đường cho sự thống nhất nước Đức vào năm 1990.',
    category: 'Lịch sử Thế giới',
    difficulty: 'Trung bình',
    period: '1989'
  },

  // --- Kháng chiến chống Pháp (Bổ sung sâu sắc) ---
  {
    id: 'vn-q23',
    question: 'Chiến dịch Biên giới Thu - Đông năm 1950 có ý nghĩa chiến lược quan trọng nào?',
    options: [
      'Giành lại quyền chủ động chiến lược trên chiến trường chính Bắc Bộ',
      'Giải phóng hoàn toàn miền Bắc',
      'Buộc thực dân Pháp ký Hiệp định Genève',
      'Tiêu diệt tập đoàn cứ điểm Điện Biên Phủ'
    ],
    correct: 0,
    explanation: 'Chiến dịch Biên giới Thu - Đông 1950 thắng lợi giúp ta khai thông biên giới Việt - Trung, mở rộng căn cứ địa Việt Bắc và giành thế chủ động chiến lược trên chiến trường chính Bắc Bộ.',
    category: 'Kháng chiến chống Pháp',
    difficulty: 'Khó',
    period: '1950'
  },
  {
    id: 'vn-q24',
    question: 'Lời kêu gọi "Toàn quốc kháng chiến" của Chủ tịch Hồ Chí Minh được phát động vào ngày nào?',
    options: ['19 tháng 8 năm 1945', '2 tháng 9 năm 1945', '19 tháng 12 năm 1946', '7 tháng 5 năm 1954'],
    correct: 2,
    explanation: 'Đêm ngày 19/12/1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến: "Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ".',
    category: 'Kháng chiến chống Pháp',
    difficulty: 'Dễ',
    period: '1946'
  },
  {
    id: 'vn-q25',
    question: 'Trong chiến dịch Điện Biên Phủ 1954, ai là vị tướng giữ chức Tổng tư lệnh kiêm Chỉ huy trưởng chiến dịch?',
    options: ['Đại tướng Võ Nguyên Giáp', 'Đại tướng Nguyễn Chí Thanh', 'Đại tướng Văn Tiến Dũng', 'Trung tướng Hoàng Văn Thái'],
    correct: 0,
    explanation: 'Đại tướng Võ Nguyên Giáp là Chỉ huy trưởng kiêm Bí thư Đảng ủy chiến dịch Điện Biên Phủ, người đã đưa ra quyết định lịch sử chuyển phương châm từ "đánh nhanh, thắng nhanh" sang "đánh chắc, tiến chắc".',
    category: 'Kháng chiến chống Pháp',
    difficulty: 'Dễ',
    period: '1954'
  }
];

export const CATEGORIES = [
  'Tất cả chủ đề',
  'Kháng chiến chống Pháp',
  'Kháng chiến chống Mỹ',
  'Cách mạng tháng Tám 1945',
  'Việt Nam Cổ - Trung đại',
  'Thành lập Đảng & Phong trào',
  'Lịch sử Thế giới'
];

export const DEFAULT_TOPICS = [
  {
    id: 'topic-history',
    title: 'Lịch sử Việt Nam & Thế giới',
    description: 'Chiến thắng Điện Biên Phủ, Cách mạng tháng 8, Kháng chiến chống Pháp & Mỹ, Lịch sử Thế giới.',
    isDefault: true,
    questions: INITIAL_QUIZ_DATA
  },
  {
    id: 'topic-geography',
    title: 'Địa Lý Việt Nam & Tự Nhiên',
    description: 'Địa hình, khí hậu, sông ngòi và các vùng kinh tế trọng điểm của Việt Nam.',
    isDefault: true,
    questions: [
      {
        id: 'geo-1',
        question: 'Đỉnh núi cao nhất Việt Nam và được mệnh danh là "Nóc nhà Đông Dương" là đỉnh nào?',
        options: ['Fansipan (Phan Xi Păng)', 'Tây Côn Lĩnh', 'Pu Si Lung', 'Ngọc Linh'],
        correct: 0,
        explanation: 'Đỉnh Fansipan cao 3.143m thuộc dãy Hoàng Liên Sơn, là ngọn núi cao nhất Việt Nam và bán đảo Đông Dương.',
        category: 'Địa lý Tự nhiên'
      },
      {
        id: 'geo-2',
        question: 'Việt Nam tiếp giáp với những quốc gia nào trên đất liền?',
        options: ['Trung Quốc, Lào, Campuchia', 'Trung Quốc, Thái Lan, Campuchia', 'Lào, Campuchia, Myanmar', 'Trung Quốc, Lào, Thái Lan'],
        correct: 0,
        explanation: 'Trên đất liền, đường biên giới của Việt Nam giáp với 3 nước: Trung Quốc ở phía bắc, Lào và Campuchia ở phía tây.',
        category: 'Địa lý Tự nhiên'
      },
      {
        id: 'geo-3',
        question: 'Vịnh biển nào của Việt Nam hai lần được UNESCO công nhận là Di sản Thiên nhiên Thế giới?',
        options: ['Vịnh Nha Trang', 'Vịnh Hạ Long', 'Vịnh Cam Ranh', 'Vịnh Lăng Cô'],
        correct: 1,
        explanation: 'Vịnh Hạ Long (Quảng Ninh) được UNESCO công nhận Di sản Thế giới vào năm 1994 (giá trị thẩm mỹ) và năm 2000 (giá trị địa chất - địa mạo).',
        category: 'Danh lam Thắng cảnh'
      },
      {
        id: 'geo-4',
        question: 'Sông Mê Kông chảy vào Việt Nam qua hai nhánh chính nào đổ ra Biển Đông?',
        options: ['Sông Tiền và Sông Hậu', 'Sông Đồng Nai và Sông Sài Gòn', 'Sông Hồng và Sông Đáy', 'Sông Mã và Sông Chu'],
        correct: 0,
        explanation: 'Khi vào đồng bằng sông Cửu Long, dòng Mekong chia làm 2 nhánh chính là Sông Tiền và Sông Hậu rồi đổ ra biển qua các cửa sông.',
        category: 'Sông ngòi & Thủy văn'
      },
      {
        id: 'geo-5',
        question: 'Quần đảo Hoàng Sa và Trường Sa thuộc chủ quyền của Việt Nam nằm ở vùng biển nào?',
        options: ['Biển Đông', 'Biển Hoa Đông', 'Biển Andaman', 'Vịnh Thái Lan'],
        correct: 0,
        explanation: 'Quần đảo Hoàng Sa (thuộc TP Đà Nẵng) và Trường Sa (thuộc tỉnh Khánh Hòa) là hai quần đảo thiêng liêng nằm trên Biển Đông thuộc chủ quyền của Việt Nam.',
        category: 'Biển đảo Việt Nam'
      }
    ]
  },
  {
    id: 'topic-english',
    title: 'Tiếng Anh - Từ Vựng & Ngữ Pháp',
    description: 'Ôn tập ngữ pháp căn bản, thì tiếng Anh, từ vựng thông dụng và cấu trúc câu.',
    isDefault: true,
    questions: [
      {
        id: 'eng-1',
        question: 'Choose the correct sentence: "She _______ to the library yesterday."',
        options: ['go', 'goes', 'went', 'has gone'],
        correct: 2,
        explanation: 'Trạng từ thời gian "yesterday" (hôm qua) chỉ hành động đã xảy ra và chấm dứt trong quá khứ nên dùng thì Quá khứ đơn (went).',
        category: 'Grammar'
      },
      {
        id: 'eng-2',
        question: 'What is the opposite of the adjective "ANCIENT"?',
        options: ['Historic', 'Modern', 'Old', 'Antique'],
        correct: 1,
        explanation: '"Ancient" có nghĩa là cổ đại, xa xưa. Từ trái nghĩa trực tiếp là "Modern" (hiện đại).',
        category: 'Vocabulary'
      },
      {
        id: 'eng-3',
        question: 'Identify the correct preposition: "He is keen _______ playing chess."',
        options: ['in', 'on', 'at', 'with'],
        correct: 1,
        explanation: 'Cụm tính từ "keen on something / doing something" có nghĩa là say mê, rất thích cái gì.',
        category: 'Prepositions'
      },
      {
        id: 'eng-4',
        question: 'Which word is a synonym of "BEAUTIFUL"?',
        options: ['Gorgeous', 'Awful', 'Ugly', 'Dull'],
        correct: 0,
        explanation: '"Gorgeous" (lộng lẫy, tuyệt đẹp) là từ đồng nghĩa với "Beautiful".',
        category: 'Vocabulary'
      },
      {
        id: 'eng-5',
        question: 'If it rains tomorrow, we _______ stay at home.',
        options: ['would', 'will', 'did', 'had'],
        correct: 1,
        explanation: 'Câu điều kiện loại 1 (Conditional Type 1): If + S + V(hiện tại đơn), S + will + V(nguyên mẫu).',
        category: 'Conditionals'
      }
    ]
  },
  {
    id: 'topic-informatics',
    title: 'Tin Học & Công Nghệ Số',
    description: 'Kiến thức máy tính căn bản, mạng internet, phần mềm và an toàn thông tin số.',
    isDefault: true,
    questions: [
      {
        id: 'it-1',
        question: 'Bộ phận nào được coi là "bộ não" điều khiển và xử lý mọi tác vụ của máy tính?',
        options: ['RAM', 'CPU (Central Processing Unit)', 'Ổ cứng SSD', 'Nguồn điện PSU'],
        correct: 1,
        explanation: 'CPU (bộ vi xử lý trung tâm) thực hiện các phép tính và chỉ huy hoạt động của mọi thành phần khác trong máy tính.',
        category: 'Phần cứng'
      },
      {
        id: 'it-2',
        question: '1 Gigabyte (GB) bằng bao nhiêu Megabyte (MB) theo chuẩn lũy thừa 2 (binary)?',
        options: ['1000 MB', '1024 MB', '512 MB', '2048 MB'],
        correct: 1,
        explanation: 'Trong hệ đếm nhị phân máy tính: 1 GB = 1024 MB (2^10 MB).',
        category: 'Đơn vị đo lường'
      },
      {
        id: 'it-3',
        question: 'Giao thức bảo mật phổ biến hiện nay khi duyệt web an toàn (có biểu tượng ổ khóa) là gì?',
        options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
        correct: 1,
        explanation: 'HTTPS (Hypertext Transfer Protocol Secure) sử dụng chứng chỉ mã hóa SSL/TLS để bảo vệ dữ liệu truyền tải giữa trình duyệt và máy chủ web.',
        category: 'Mạng Internet'
      },
      {
        id: 'it-4',
        question: 'Phím tắt thông dụng trên Windows để dán (Paste) nội dung vừa sao chép vào văn bản là gì?',
        options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + Z'],
        correct: 1,
        explanation: 'Ctrl + V dùng để dán (Paste), Ctrl + C dùng để sao chép (Copy), Ctrl + X để cắt (Cut), Ctrl + Z để hoàn tác (Undo).',
        category: 'Kỹ năng sử dụng'
      },
      {
        id: 'it-5',
        question: 'Định dạng tệp tin nào thường được dùng để trao đổi dữ liệu có cấu trúc nhẹ giữa các ứng dụng web?',
        options: ['JSON', 'EXE', 'DLL', 'BAT'],
        correct: 0,
        explanation: 'JSON (JavaScript Object Notation) là định dạng dữ liệu văn bản tiêu chuẩn, dễ đọc cho cả người và máy, được dùng rộng rãi trên Internet.',
        category: 'Dữ liệu số'
      }
    ]
  }
];
