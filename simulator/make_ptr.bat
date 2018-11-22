@echo off
#git mv wizard.js ptr_wizard.js
#git mv witchdoctor.js ptr_witchdoctor.js
#git mv demonhunter.js ptr_demonhunter.js
#git mv barbarian.js ptr_barbarian.js
#git mv monk.js ptr_monk.js
#git mv crusader.js ptr_crusader.js
git mv itemsets.js ptr_itemsets.js
git mv itemspecial.js ptr_itemspecial.js
git commit -ma"moving files to ptr"
#copy ptr_wizard.js wizard.js
#copy ptr_witchdoctor.js witchdoctor.js
#copy ptr_demonhunter.js demonhunter.js
#copy ptr_barbarian.js barbarian.js
#copy ptr_monk.js monk.js
#copy ptr_crusader.js crusader.js
copy ptr_itemsets.js itemsets.js
copy ptr_itemspecial.js itemspecial.js
git add *
git commit -ma"copying files to live"
