const antenna_geometry = () => {
    const geodata = [{"A0":{"X":-4.33,"Y":-8.5,"Z":1.12044},"A1":{"X":-2.598,"Y":-8.5,"Z":1.11041},"A2":{"X":-0.866,"Y":-8.5,"Z":1.07234},"A3":{"X":0.866,"Y":-8.5,"Z":1.02838},"A4":{"X":2.598,"Y":-8.5,"Z":1.0415},"A5":{"X":4.33,"Y":-8.5,"Z":1.01159},"A6":{"X":-5.196,"Y":-8.0,"Z":1.12343},"A7":{"X":-3.464,"Y":-8.0,"Z":1.11048},"A8":{"X":-1.732,"Y":-8.0,"Z":1.0635},"A9":{"X":0.0,"Y":-8.0,"Z":1.04284},"A10":{"X":1.732,"Y":-8.0,"Z":1.02572},"A11":{"X":3.464,"Y":-8.0,"Z":1.0178},"A12":{"X":5.196,"Y":-8.0,"Z":0.96373},"A13":{"X":-5.196,"Y":-7.0,"Z":1.10192},"A14":{"X":-3.464,"Y":-7.0,"Z":1.084},"A15":{"X":-1.732,"Y":-7.0,"Z":1.05926},"A16":{"X":0.0,"Y":-7.0,"Z":1.0522},"A17":{"X":1.732,"Y":-7.0,"Z":1.02976},"A18":{"X":3.464,"Y":-7.0,"Z":1.01638},"A19":{"X":5.196,"Y":-7.0,"Z":1.007},"A20":{"X":-6.062,"Y":-6.5,"Z":1.102},"A21":{"X":-4.33,"Y":-6.5,"Z":1.09154},"A22":{"X":-2.598,"Y":-6.5,"Z":1.07308},"A23":{"X":-0.866,"Y":-6.5,"Z":1.05616},"A24":{"X":0.866,"Y":-6.5,"Z":1.04201},"A25":{"X":2.598,"Y":-6.5,"Z":1.02813},"A26":{"X":4.33,"Y":-6.5,"Z":1.01049},"A27":{"X":6.062,"Y":-6.5,"Z":0.99322},"A28":{"X":-6.062,"Y":-5.5,"Z":1.09829},"A29":{"X":-4.33,"Y":-5.5,"Z":1.08443},"A30":{"X":-2.598,"Y":-5.5,"Z":1.07425},"A31":{"X":-0.866,"Y":-5.5,"Z":1.04966},"A32":{"X":0.866,"Y":-5.5,"Z":1.04386},"A33":{"X":2.598,"Y":-5.5,"Z":1.03283},"A34":{"X":4.33,"Y":-5.5,"Z":1.02},"A35":{"X":6.062,"Y":-5.5,"Z":1.00257},"A36":{"X":-6.928,"Y":-5.0,"Z":1.1038},"A37":{"X":-5.196,"Y":-5.0,"Z":1.07639},"A38":{"X":-3.464,"Y":-5.0,"Z":1.07112},"A39":{"X":-1.732,"Y":-5.0,"Z":1.06929},"A40":{"X":0.0,"Y":-5.0,"Z":1.05116},"A41":{"X":1.732,"Y":-5.0,"Z":1.04263},"A42":{"X":3.464,"Y":-5.0,"Z":1.04482},"A43":{"X":5.196,"Y":-5.0,"Z":1.01692},"A44":{"X":6.928,"Y":-5.0,"Z":1.00329},"A45":{"X":-6.928,"Y":-4.0,"Z":1.11462},"A46":{"X":-5.196,"Y":-4.0,"Z":1.09923},"A47":{"X":-3.464,"Y":-4.0,"Z":1.08401},"A48":{"X":-1.732,"Y":-4.0,"Z":1.08036},"A49":{"X":0.0,"Y":-4.0,"Z":1.06364},"A50":{"X":1.732,"Y":-4.0,"Z":1.05375},"A51":{"X":3.464,"Y":-4.0,"Z":1.03557},"A52":{"X":5.196,"Y":-4.0,"Z":1.02113},"A53":{"X":6.928,"Y":-4.0,"Z":1.00715},"A54":{"X":-7.794,"Y":-3.5,"Z":1.13312},"A55":{"X":-6.062,"Y":-3.5,"Z":1.12407},"A56":{"X":-4.33,"Y":-3.5,"Z":1.10656},"A57":{"X":-2.598,"Y":-3.5,"Z":1.11537},"A58":{"X":-0.866,"Y":-3.5,"Z":1.07505},"A59":{"X":0.866,"Y":-3.5,"Z":1.06166},"A60":{"X":2.598,"Y":-3.5,"Z":1.04749},"A61":{"X":4.33,"Y":-3.5,"Z":1.03534},"A62":{"X":6.062,"Y":-3.5,"Z":1.0187},"A63":{"X":7.794,"Y":-3.5,"Z":0.99308},"A64":{"X":-7.794,"Y":-2.5,"Z":1.14951},"A65":{"X":-6.062,"Y":-2.5,"Z":1.13657},"A66":{"X":-4.33,"Y":-2.5,"Z":1.11851},"A67":{"X":-2.598,"Y":-2.5,"Z":1.10381},"A68":{"X":-0.866,"Y":-2.5,"Z":1.09378},"A69":{"X":0.866,"Y":-2.5,"Z":1.07346},"A70":{"X":2.598,"Y":-2.5,"Z":1.05279},"A71":{"X":4.33,"Y":-2.5,"Z":1.04311},"A72":{"X":6.062,"Y":-2.5,"Z":0.99296},"A73":{"X":7.794,"Y":-2.5,"Z":0.99469},"A74":{"X":-8.66,"Y":-2.0,"Z":1.16886},"A75":{"X":-6.928,"Y":-2.0,"Z":1.15258},"A76":{"X":-5.196,"Y":-2.0,"Z":1.14993},"A77":{"X":-3.464,"Y":-2.0,"Z":1.1154},"A78":{"X":-1.732,"Y":-2.0,"Z":1.10659},"A79":{"X":0.0,"Y":-2.0,"Z":1.08871},"A80":{"X":1.732,"Y":-2.0,"Z":1.07359},"A81":{"X":3.464,"Y":-2.0,"Z":1.04328},"A82":{"X":5.196,"Y":-2.0,"Z":0.96601},"A83":{"X":6.928,"Y":-2.0,"Z":0.99678},"A84":{"X":8.66,"Y":-2.0,"Z":0.98117},"A85":{"X":-8.66,"Y":-1.0,"Z":1.17903},"A86":{"X":-6.928,"Y":-1.0,"Z":1.17152},"A87":{"X":-5.196,"Y":-1.0,"Z":1.14682},"A88":{"X":-3.464,"Y":-1.0,"Z":1.13196},"A89":{"X":-1.732,"Y":-1.0,"Z":1.11787},"A90":{"X":0.0,"Y":-1.0,"Z":1.08615},"A91":{"X":1.732,"Y":-1.0,"Z":1.06402},"A92":{"X":3.464,"Y":-1.0,"Z":1.03976},"A93":{"X":5.196,"Y":-1.0,"Z":1.00991},"A94":{"X":6.928,"Y":-1.0,"Z":0.99128},"A95":{"X":8.66,"Y":-1.0,"Z":0.9611},"A96":{"X":-9.526,"Y":-0.5,"Z":1.21425},"A97":{"X":-7.794,"Y":-0.5,"Z":1.17867},"A98":{"X":-6.062,"Y":-0.5,"Z":1.16294},"A99":{"X":-4.33,"Y":-0.5,"Z":1.14696},"A100":{"X":-2.598,"Y":-0.5,"Z":1.12334},"A101":{"X":-0.866,"Y":-0.5,"Z":1.10014},"A102":{"X":0.866,"Y":-0.5,"Z":1.07185},"A103":{"X":2.598,"Y":-0.5,"Z":1.04657},"A104":{"X":4.33,"Y":-0.5,"Z":1.03006},"A105":{"X":6.062,"Y":-0.5,"Z":0.99993},"A106":{"X":7.794,"Y":-0.5,"Z":0.97591},"A107":{"X":9.526,"Y":-0.5,"Z":0.96339},"A108":{"X":-9.526,"Y":0.5,"Z":1.22381},"A109":{"X":-7.794,"Y":0.5,"Z":1.19673},"A110":{"X":-6.062,"Y":0.5,"Z":1.16802},"A111":{"X":-4.33,"Y":0.5,"Z":1.14509},"A112":{"X":-2.598,"Y":0.5,"Z":1.118},"A113":{"X":-0.866,"Y":0.5,"Z":1.10021},"A114":{"X":0.866,"Y":0.5,"Z":1.07007},"A115":{"X":2.598,"Y":0.5,"Z":1.0517},"A116":{"X":4.33,"Y":0.5,"Z":1.027},"A117":{"X":6.062,"Y":0.5,"Z":0.99042},"A118":{"X":7.794,"Y":0.5,"Z":0.98854},"A119":{"X":9.526,"Y":0.5,"Z":0.9732},"A120":{"X":-8.66,"Y":1.0,"Z":1.21093},"A121":{"X":-6.928,"Y":1.0,"Z":1.18459},"A122":{"X":-5.196,"Y":1.0,"Z":1.15712},"A123":{"X":-3.464,"Y":1.0,"Z":1.13404},"A124":{"X":-1.732,"Y":1.0,"Z":1.11314},"A125":{"X":0.0,"Y":1.0,"Z":1.07986},"A126":{"X":1.732,"Y":1.0,"Z":1.04986},"A127":{"X":3.464,"Y":1.0,"Z":1.033},"A128":{"X":5.196,"Y":1.0,"Z":1.0102},"A129":{"X":6.928,"Y":1.0,"Z":0.98296},"A130":{"X":8.66,"Y":1.0,"Z":0.98634},"A131":{"X":-8.66,"Y":2.0,"Z":1.20227},"A132":{"X":-6.928,"Y":2.0,"Z":1.1764},"A133":{"X":-5.196,"Y":2.0,"Z":1.14697},"A134":{"X":-3.464,"Y":2.0,"Z":1.12151},"A135":{"X":-1.732,"Y":2.0,"Z":1.09604},"A136":{"X":0.0,"Y":2.0,"Z":1.0638},"A137":{"X":1.732,"Y":2.0,"Z":1.04664},"A138":{"X":3.464,"Y":2.0,"Z":1.02596},"A139":{"X":5.196,"Y":2.0,"Z":1.01279},"A140":{"X":6.928,"Y":2.0,"Z":0.9946},"A141":{"X":8.66,"Y":2.0,"Z":0.994},"A142":{"X":-7.794,"Y":2.5,"Z":1.18527},"A143":{"X":-6.062,"Y":2.5,"Z":1.16152},"A144":{"X":-4.33,"Y":2.5,"Z":1.13064},"A145":{"X":-2.598,"Y":2.5,"Z":1.10546},"A146":{"X":-0.866,"Y":2.5,"Z":1.07175},"A147":{"X":0.866,"Y":2.5,"Z":1.05506},"A148":{"X":2.598,"Y":2.5,"Z":1.03926},"A149":{"X":4.33,"Y":2.5,"Z":1.02208},"A150":{"X":6.062,"Y":2.5,"Z":0.99846},"A151":{"X":7.794,"Y":2.5,"Z":1.00469},"A152":{"X":-7.794,"Y":3.5,"Z":1.18085},"A153":{"X":-6.062,"Y":3.5,"Z":1.14854},"A154":{"X":-4.33,"Y":3.5,"Z":1.13195},"A155":{"X":-2.598,"Y":3.5,"Z":1.09559},"A156":{"X":-0.866,"Y":3.5,"Z":1.06977},"A157":{"X":0.866,"Y":3.5,"Z":1.05795},"A158":{"X":2.598,"Y":3.5,"Z":1.04127},"A159":{"X":4.33,"Y":3.5,"Z":1.03868},"A160":{"X":6.062,"Y":3.5,"Z":1.02569},"A161":{"X":7.794,"Y":3.5,"Z":1.00462},"A162":{"X":-6.928,"Y":4.0,"Z":1.16947},"A163":{"X":-5.196,"Y":4.0,"Z":1.14657},"A164":{"X":-3.464,"Y":4.0,"Z":1.11833},"A165":{"X":-1.732,"Y":4.0,"Z":1.04953},"A166":{"X":0.0,"Y":4.0,"Z":1.04135},"A167":{"X":1.732,"Y":4.0,"Z":1.04226},"A168":{"X":3.464,"Y":4.0,"Z":1.03724},"A169":{"X":5.196,"Y":4.0,"Z":1.02473},"A170":{"X":6.928,"Y":4.0,"Z":1.02107},"A171":{"X":-6.928,"Y":5.0,"Z":1.15915},"A172":{"X":-5.196,"Y":5.0,"Z":1.1347},"A173":{"X":-3.464,"Y":5.0,"Z":1.10623},"A174":{"X":-1.732,"Y":5.0,"Z":1.077},"A175":{"X":0.0,"Y":5.0,"Z":1.05715},"A176":{"X":1.732,"Y":5.0,"Z":1.03572},"A177":{"X":3.464,"Y":5.0,"Z":1.03985},"A178":{"X":5.196,"Y":5.0,"Z":1.03772},"A179":{"X":6.928,"Y":5.0,"Z":1.00348},"A180":{"X":-6.062,"Y":5.5,"Z":1.14421},"A181":{"X":-4.33,"Y":5.5,"Z":1.11547},"A182":{"X":-2.598,"Y":5.5,"Z":1.07678},"A183":{"X":-0.866,"Y":5.5,"Z":1.06792},"A184":{"X":0.866,"Y":5.5,"Z":1.053},"A185":{"X":2.598,"Y":5.5,"Z":1.05308},"A186":{"X":4.33,"Y":5.5,"Z":1.0497},"A187":{"X":6.062,"Y":5.5,"Z":1.01766},"A188":{"X":-6.062,"Y":6.5,"Z":1.12378},"A189":{"X":-4.33,"Y":6.5,"Z":1.1161},"A190":{"X":-2.598,"Y":6.5,"Z":1.09462},"A191":{"X":-0.866,"Y":6.5,"Z":1.08304},"A192":{"X":0.866,"Y":6.5,"Z":1.06998},"A193":{"X":2.598,"Y":6.5,"Z":1.06675},"A194":{"X":4.33,"Y":6.5,"Z":1.04735},"A195":{"X":6.062,"Y":6.5,"Z":1.03135},"A196":{"X":-5.196,"Y":7.0,"Z":1.12115},"A197":{"X":-3.464,"Y":7.0,"Z":1.10777},"A198":{"X":-1.732,"Y":7.0,"Z":1.09449},"A199":{"X":0.0,"Y":7.0,"Z":1.07811},"A200":{"X":1.732,"Y":7.0,"Z":1.0752},"A201":{"X":3.464,"Y":7.0,"Z":1.05766},"A202":{"X":5.196,"Y":7.0,"Z":1.0436},"A203":{"X":-5.196,"Y":8.0,"Z":1.13657},"A204":{"X":-3.464,"Y":8.0,"Z":1.12298},"A205":{"X":-1.732,"Y":8.0,"Z":1.09735},"A206":{"X":0.0,"Y":8.0,"Z":1.0903},"A207":{"X":1.732,"Y":8.0,"Z":1.07643},"A208":{"X":3.464,"Y":8.0,"Z":1.05526},"A209":{"X":5.196,"Y":8.0,"Z":1.00703},"A210":{"X":-4.33,"Y":8.5,"Z":1.13},"A211":{"X":-2.598,"Y":8.5,"Z":1.10669},"A212":{"X":-0.866,"Y":8.5,"Z":1.09823},"A213":{"X":0.866,"Y":8.5,"Z":1.088},"A214":{"X":2.598,"Y":8.5,"Z":1.06703},"A215":{"X":4.33,"Y":8.5,"Z":1.04872},"A216":{"X":-1.299,"Y":-2.75,"Z":1.09305},"A217":{"X":-0.433,"Y":-2.75,"Z":1.08323},"A218":{"X":0.433,"Y":-2.75,"Z":1.07994},"A219":{"X":1.299,"Y":-2.75,"Z":1.06376},"A220":{"X":-1.732,"Y":-2.5,"Z":1.10194},"A221":{"X":0.0,"Y":-2.5,"Z":1.08602},"A222":{"X":1.732,"Y":-2.5,"Z":1.06553},"A223":{"X":-0.866,"Y":-2.0,"Z":1.09765},"A224":{"X":0.866,"Y":-2.0,"Z":1.08196},"A225":{"X":-2.165,"Y":-1.75,"Z":1.11321},"A226":{"X":-1.299,"Y":-1.75,"Z":1.10712},"A227":{"X":-0.433,"Y":-1.75,"Z":1.095},"A228":{"X":0.433,"Y":-1.75,"Z":1.08823},"A229":{"X":1.299,"Y":-1.75,"Z":1.07914},"A230":{"X":2.165,"Y":-1.75,"Z":1.06382},"A231":{"X":-2.165,"Y":-1.25,"Z":1.11706},"A232":{"X":-1.299,"Y":-1.25,"Z":1.10751},"A233":{"X":-0.433,"Y":-1.25,"Z":1.0983},"A234":{"X":0.433,"Y":-1.25,"Z":1.08566},"A235":{"X":1.299,"Y":-1.25,"Z":1.074},"A236":{"X":2.165,"Y":-1.25,"Z":1.0627},"A237":{"X":-2.598,"Y":-1.0,"Z":1.12481},"A238":{"X":-0.866,"Y":-1.0,"Z":1.10315},"A239":{"X":0.866,"Y":-1.0,"Z":1.07714},"A240":{"X":2.598,"Y":-1.0,"Z":1.05083},"A241":{"X":-1.732,"Y":-0.5,"Z":1.11642},"A242":{"X":0.0,"Y":-0.5,"Z":1.08293},"A243":{"X":1.732,"Y":-0.5,"Z":1.058},"A244":{"X":-3.031,"Y":-0.25,"Z":1.1326},"A245":{"X":-2.165,"Y":-0.25,"Z":1.112},"A246":{"X":-1.299,"Y":-0.25,"Z":1.10741},"A247":{"X":-0.433,"Y":-0.25,"Z":1.08957},"A248":{"X":0.433,"Y":-0.25,"Z":1.07892},"A249":{"X":1.299,"Y":-0.25,"Z":1.06503},"A250":{"X":2.165,"Y":-0.25,"Z":1.06555},"A251":{"X":3.031,"Y":-0.25,"Z":1.04054},"A252":{"X":-3.031,"Y":0.25,"Z":1.12692},"A253":{"X":-2.165,"Y":0.25,"Z":1.11665},"A254":{"X":-1.299,"Y":0.25,"Z":1.10548},"A255":{"X":-0.433,"Y":0.25,"Z":1.09507},"A256":{"X":0.433,"Y":0.25,"Z":1.08689},"A257":{"X":1.299,"Y":0.25,"Z":1.06395},"A258":{"X":2.165,"Y":0.25,"Z":1.0511},"A259":{"X":3.031,"Y":0.25,"Z":1.039},"A260":{"X":-1.732,"Y":0.5,"Z":1.10806},"A261":{"X":0.0,"Y":0.5,"Z":1.085},"A262":{"X":1.732,"Y":0.5,"Z":1.051},"A263":{"X":-2.598,"Y":1.0,"Z":1.12489},"A264":{"X":-0.866,"Y":1.0,"Z":1.09777},"A265":{"X":0.866,"Y":1.0,"Z":1.06976},"A266":{"X":2.598,"Y":1.0,"Z":1.04557},"A267":{"X":-2.165,"Y":1.25,"Z":1.11821},"A268":{"X":-1.299,"Y":1.25,"Z":1.10057},"A269":{"X":-0.433,"Y":1.25,"Z":1.08501},"A270":{"X":0.433,"Y":1.25,"Z":1.06993},"A271":{"X":1.299,"Y":1.25,"Z":1.04991},"A272":{"X":2.165,"Y":1.25,"Z":1.04576},"A273":{"X":-2.165,"Y":1.75,"Z":1.10779},"A274":{"X":-1.299,"Y":1.75,"Z":1.09513},"A275":{"X":-0.433,"Y":1.75,"Z":1.07357},"A276":{"X":0.433,"Y":1.75,"Z":1.06503},"A277":{"X":1.299,"Y":1.75,"Z":1.05394},"A278":{"X":2.165,"Y":1.75,"Z":1.04275},"A279":{"X":-0.866,"Y":2.0,"Z":1.07972},"A280":{"X":0.866,"Y":2.0,"Z":1.05979},"A281":{"X":-1.732,"Y":2.5,"Z":1.08751},"A282":{"X":0.0,"Y":2.5,"Z":1.06062},"A283":{"X":1.732,"Y":2.5,"Z":1.05177},"A284":{"X":-1.299,"Y":2.75,"Z":1.08852},"A285":{"X":-0.433,"Y":2.75,"Z":1.07685},"A286":{"X":0.433,"Y":2.75,"Z":1.06902},"A287":{"X":1.299,"Y":2.75,"Z":1.06881}}];
    return geodata;
};