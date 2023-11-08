<script setup>
  const user = useFirebaseUser();
  const currentUser = ref(user)
  
  const social = ref({
    email: currentUser?.value?.email || '',
    fb: 'kathrynluo.0331@gmail.com',
    ig: 'kathrynluo.0331@gmail.com'
  })

  const bookList = ref([
    {
      id: 1,
      name: '失控的群體思維：從同儕壓力到同溫層效應，人的一舉一動都逃不出「群性」。失控的群體思維：從同儕壓力到同溫層效應，人的一舉一動都逃不出「群性」',
      author: '麥可．龐德',
      ISBN: '9789579094672',
      // date: '2023/10/20',
      isReading: false,
    },
    {
      id: 2,
      name: '無限賽局：翻轉思維框架，突破勝負盲點，贏得你想要的未來',
      author: '賽門．西奈克',
      ISBN: '9789863986348',
      date: '2023/10/20',
      isReading: true,
    },
    {
      id: 3,
      name: '致富心態：關於財富、貪婪與幸福的20堂理財課',
      author: '摩根．豪瑟',
      ISBN: '9789865250348',
      isReading: false
    },
    {
      id: 4,
      name: '情緒寄生：與自我和解的34則情感教育',
      author: '許皓宜',
      ISBN: '9789573283713',
      isReading: false
    },
  ])

  const readingBookList = ref([])
  const readDoneBookList = ref([])
  bookList.value.forEach((book) => {
    if (book.isReading) {
      readingBookList.value.push(book)
    } else {
      readDoneBookList.value.push(book)
    }
  })
</script>

<template>
    <div class="flex w-3/5 mx-auto mb-10">
      <div
        class=" h-[150px] w-[150px] shadow-lg border-4 border-solid border-cyan-700 rounded-full bg-slate-300 overflow-hidden">
        <NuxtImg
          v-if="user?.image"
          :src="user?.image"
          width="150"
          height="150"
        />
      </div>
      <div class="pl-8 flex flex-col justify-around">
        <div>
          <h2 v-if="user?.displayName" class="text-2xl">{{ user?.displayName }}</h2>
          <p></p>
        </div>
        <div>
          <q-btn
            v-if="social.email"
            icon="mail_outline"
            :title="social.email"
            round
            unelevated
            size="sm"
            class="bg-amber-400 text-white mr-2"
            />
          <q-btn
            v-if="social.fb"
            icon="lab la-facebook-f"
            round
            unelevated
            size="sm"
            class=" bg-[#3b5998] text-white mr-2"
            />
          <q-btn
            v-if="social.ig"
            icon="lab la-instagram"
            round
            unelevated
            size="sm"
            class=" bg-[#3b5998] text-white"
            />
        </div>
      </div>

    </div>
    <BookBlock title="閱讀中" :bookList="readingBookList" />
      
    <BookBlock title="閱讀紀錄" class=" mt-5" :bookList="readDoneBookList"/>

</template>